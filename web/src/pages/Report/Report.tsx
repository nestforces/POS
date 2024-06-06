import {
	Box,
	Button,
	HStack,
	Input,
	Spacer,
	Text,
	IconButton,
	Heading,
	FormLabel,
	Flex,
} from "@chakra-ui/react";
import {
	
	IconArrowNarrowDown,
	IconInfoCircleFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SidebarWithHeader } from "../../components/SideBar/SideBar";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { toPng } from "html-to-image";
import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Sales Data",
		},
	},
};

function formatPriceToIDR(price) {
	// Use Intl.NumberFormat to format the number as IDR currency
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(price);
}

function formatISODate(isoDateString) {
	const date = new Date(isoDateString);

	// Format date and time in a readable way
	const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	return formattedDateTime;
}

const Report = () => {
	const [salesData, setSalesData] = useState([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [reportData, setReportData] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [totalProductsSold, setTotalProductsSold] = useState(0);
	const [totalTransactions, setTotalTransactions] = useState(0);

	// Get today's date
	const today = new Date();

	// Get yesterday's date
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	// Format the dates to a string in "YYYY-MM-DD" format
	const formattedToday = formatDate(today);
	const formattedYesterday = formatDate(yesterday);

	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	console.log("Today:", formattedToday);
	console.log("Yesterday:", formattedYesterday);

	console.log("ini start date", startDate);

	const fetchReport = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/report/sales-report?startDate=${startDate}&endDate=${endDate}`
			);

			setReportData(response?.data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/report/sales-by-date?startDate=${startDate}&endDate=${endDate}`
			);
			setSalesData(response?.data);

			const totalRevenue1 = salesData?.reduce(
				(acc, item) => acc + item?.totalSales,
				0
			);
			const totalProductsSold1 = salesData?.reduce(
				(acc, item) => acc + item?.totalQuantity,
				0
			);
			const totalTransactions1 = salesData?.reduce(
				(acc, item) => acc + item?.totalTransactions,
				0
			);

			// Update state
			setTotalRevenue(totalRevenue1);
			setTotalProductsSold(totalProductsSold1);
			setTotalTransactions(totalTransactions1);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchData();
		fetchReport();
	}, [startDate, endDate]);

	console.log(salesData);

	const handleItemClick = (itemId: number) => {
		// Toggle selection for the clicked item
		setSelectedItems((prevSelectedItems) => {
			if (prevSelectedItems.includes(itemId)) {
				return prevSelectedItems.filter((id) => id !== itemId);
			} else {
				return [...prevSelectedItems, itemId];
			}
		});
	};

	useEffect(() => {
		if (salesData) {
			// Call exportToPDF here, as salesData is now updated
			exportToPDF;
		}
	}, [salesData]);

	const exportToPDF = async () => {
		if (salesData && reportData) {
			// Convert Line charts to base64 images
			const salesChartImage = await convertChartToImage("chartSales");

			const groupedReportData = groupByTransactionId(reportData);

			const mostSoldProducts = getMostSoldProducts(groupedReportData);

			const docDefinition = {
				pageOrientation: "landscape",
				content: [
					{ text: "Sales Data Report", style: "header" },
					"\n",
					{
						table: {
							headerRows: 1,
							widths: ["auto", "auto", "auto", "auto"],
							body: [
								[
									"Date",
									"Total Sales",
									"Total Quantity",
									"Total Transactions",
								],
								...salesData.map((item) => [
									item.saleDate,
									formatPriceToIDR(item.totalSales),
									item.totalQuantity,
									item.totalTransactions,
								]),
							],
						},
					},
					"\n\n",
					{ text: "Transaction Report", style: "header" },
					"\n",
					{
						table: {
							headerRows: 1,
							widths: [
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
								"auto",
							],
							body: [
								[
									"ID",
									"Total Quantity",
									"Total Price",
									"Date",
									"Cashier",
									"Product Name (Quantity)",
									"Transaction Item ID",
								],
								...groupedReportData.map((group) => [
									group.id,
									group.total_quantity,
									formatPriceToIDR(group.total_price),
									new Date(group.date).toLocaleString(),
									group.cashier.username,
									group.products.join(", "),
									group.transaction_items
										.map((transactionItem) => transactionItem.id)
										.join(", "),
								]),
							],
						},
					},
					"\n\n",
					{ text: "Sales Charts", style: "header" },
					"\n",
					{
						layout: "lightHorizontalLines",
						table: {
							body: [
								[
									{ image: salesChartImage, width: 500, height: 250 },
									{},
								],
							],
						},
					},
					"\n\n",
					{ text: "Products Sold", style: "header" },
					"\n",
					{
						table: {
							headerRows: 1,
							widths: ["auto", "auto"],
							body: [
								["Product Name", "Quantity Sold"],
								...mostSoldProducts.map((product) => [
									product.name,
									product.quantity,
								]),
							],
						},
					},
				],
				styles: {
					header: {
						fontSize: 18,
						bold: true,
						alignment: "center",
					},
				},
			};

			pdfMake
				.createPdf(docDefinition)
				.download("sales_data_report.pdf");
		}
	};

	const getMostSoldProducts = (groupedReportData) => {
		const productsSold = {};

		// Iterate through the grouped report data to count the quantity of each product
		groupedReportData.forEach((group) => {
			group.transaction_items.forEach((transactionItem) => {
				const productName = transactionItem.product.name;

				if (!productsSold[productName]) {
					productsSold[productName] = 0;
				}

				productsSold[productName] += transactionItem.total_quantity;
			});
		});

		// Convert the productsSold object into an array of objects
		const mostSoldProducts = Object.keys(productsSold).map(
			(productName) => ({
				name: productName,
				quantity: productsSold[productName],
			})
		);

		// Sort the array by quantity in descending order
		mostSoldProducts.sort((a, b) => b.quantity - a.quantity);

		return mostSoldProducts;
	};

	// Group reportData by transaction ID
	const groupByTransactionId = (reportData) => {
		const groupedData = {};
		reportData.forEach((item) => {
			if (!groupedData[item.id]) {
				groupedData[item.id] = {
					id: item.id,
					total_quantity: item.total_quantity,
					total_price: item.total_price,
					date: item.date,
					cashier: item.cashier,
					products: [],
					transaction_items: [],
				};
			}

			item.transaction_item.forEach((transactionItem) => {
				const existingTransactionItem = groupedData[
					item.id
				].transaction_items.find(
					(existingItem) => existingItem.id === transactionItem.id
				);

				if (!existingTransactionItem) {
					groupedData[item.id].transaction_items.push(
						transactionItem
					);
					groupedData[item.id].products.push(
						`${transactionItem.product.name} (${transactionItem.total_quantity})`
					);
				}
			});
		});

		return Object.values(groupedData);
	};

	const convertChartToImage = async (chartId) => {
		const chartElement = document.getElementById(chartId);

		if (chartElement) {
			// Convert the chart to base64
			const chartImage = await toPng(chartElement);
			return chartImage;
		}

		return null;
	};

	const labels = salesData.map((item) => item.saleDate);
	const data = {
		labels,
		datasets: [
			{
				fill: true,
				label: "Total Sales",
				data: salesData.map((item) => item.totalSales),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
			{
				fill: true,
				label: "Total Products",
				data: salesData.map((item) => item.totalQuantity),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
			{
				fill: true,
				label: "Total Transactions",
				data: salesData.map((item) => item.totalTransactions),
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
		],
	};

	console.log("ini report data", reportData);

	return (
		<>
			<SidebarWithHeader />
			<Box
				width="98.7vw"
				height="fit-content"
				backgroundColor="#fbfaf9"
				p="50px"
			>
				<Box pl={{ md: "150px", sm: "0px" }}>
					<HStack mb="10px">
						<Spacer />

						<Input
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							width="fit-content"
							type="date"
						/>
						<Text>-</Text>
						<Input
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							width="fit-content"
							type="date"
						/>
						<Button
							onClick={() => {
								Promise.all([fetchData(), fetchReport()]);
							}}
						>
							Start
						</Button>
						<Button
							onClick={exportToPDF}
							borderRadius="full"
							border="solid 1px black"
							leftIcon={<IconArrowNarrowDown />}
						>
							Download
						</Button>
					</HStack>
					<Box p="20px" boxShadow="0px 1px 5px gray">
						{salesData && salesData.length > 0 ? (
							<>
								<HStack mb="5px" textAlign="center">
									<Text fontWeight="bold" width="20%">
										Sales Date
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Revenue
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Products Sold
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Transactions
									</Text>
								</HStack>
								<Box
									as="hr"
									borderTopWidth="5px"
									borderTopColor="black.200"
								></Box>
								{salesData &&
									salesData?.map((item, index) => (
										<>
											<HStack m="10px" textAlign="center">
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.saleDate}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{formatPriceToIDR(item?.totalSales)}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.totalQuantity}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.totalTransactions}
												</Text>
											</HStack>
											<Box
												as="hr"
												borderTopWidth="2px"
												borderTopColor="black.200"
											/>
										</>
									))}{" "}
							</>
						) : (
							<>
								<Text>No Data Available</Text>
							</>
						)}
					</Box>

					<Box mt="20px" p="20px" boxShadow="0px 1px 5px gray">
						{reportData && reportData.length > 0 ? (
							<>
								<HStack mb="5px" textAlign="center">
									<Text fontWeight="bold" width="10%">
										ID
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="10%">
										Quantity
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="30%">
										Payment
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="30%">
										Date
									</Text>
									<Text width="5%"></Text>
								</HStack>
								<Box
									as="hr"
									borderTopWidth="5px"
									borderTopColor="black.200"
								></Box>
								<Box overflowY="auto" maxH="70vh">
									{reportData &&
										reportData?.map((item, index) => (
											<>
												<HStack m="10px" textAlign="center">
													<Text
														width="10%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{item?.id}
													</Text>
													<Spacer />
													<Text
														width="10%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{item?.total_quantity}
													</Text>
													<Spacer />
													<Text
														width="30%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{formatPriceToIDR(item?.total_price)}
													</Text>
													<Spacer />
													<Text
														width="30%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{formatISODate(item?.date)}
													</Text>
													<IconButton
														width="5%"
														icon={<IconInfoCircleFilled />}
														onClick={() =>
															window.open(
																`/transaction-detail/${item.id}`,
																"_blank"
															)
														}
													/>
												</HStack>
												<Box
													as="hr"
													borderTopWidth="2px"
													borderTopColor="black.200"
												/>
											</>
										))}
								</Box>{" "}
							</>
						) : (
							<>
								<Text>No Data Available</Text>
							</>
						)}
					</Box>

					<Flex
						flexDir={{ md: "row", sm: "column" }}
						mt="10px"
						columnGap="10px"
					>
						<Box
							width={{ md: "40%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Revenue</FormLabel>
							<Heading mb="5px">
								{formatPriceToIDR(totalRevenue)}
							</Heading>
						</Box>
						<Box
							width={{ md: "30%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Products Sold</FormLabel>
							<Heading mb="5px">{totalProductsSold}</Heading>
						</Box>
						<Box
							width={{ md: "30%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Transactions</FormLabel>
							<Heading mb="5px">{totalTransactions}</Heading>
						</Box>
					</Flex>
					<Box width="70vw">
						<Line
							id={"chartSales"}
							options={options}
							data={{ labels, datasets: [data.datasets[0]] }}
						/>
						<Line
							id={"chartProducts"}
							options={options}
							data={{ labels, datasets: [data.datasets[1]] }}
						/>
						<Line
							id={"chartTransactions"}
							options={options}
							data={{ labels, datasets: [data.datasets[2]] }}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export { Report };
