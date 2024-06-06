import { Box, Button, HStack, Icon, Input, InputGroup, InputLeftAddon, InputLeftElement, Spacer, Text, Image, IconButton, Card, CardBody, Stack, Heading, Divider, CardFooter, ButtonGroup, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, VStack, useColorModeValue, Select, FormLabel, Flex } from "@chakra-ui/react"
import { IconSearch, IconGraphFilled, IconPlus, IconArrowRight, IconArrowLeft, IconLayoutGrid, IconList, IconSortAscending2, IconSortDescending2, IconAbc, IconTags, IconChecks, IconError404, IconTrashx, IconEditCircle, IconArrowNarrowDown, IconTrashX } from '@tabler/icons-react'
import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import React from 'react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Sales Data',
    },
  },
};


interface Category {
  id: number;
  category: string;
}

interface ApiResponse {
  products: Product[];
  totalPages: number;
}

function formatPriceToIDR(price) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}

const DashboardAdmin = () => {
  const [salesData, setSalesData] = useState([]);
  const [dataCategory, setDataCategory] = useState([])
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc")
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [categoryId, setCategoryId] = useState([]);
  const [productName, setProductName] = useState("")
  const [viewMode, setViewMode] = useState("list");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("")

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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

console.log('Today:', formattedToday);
console.log('Yesterday:', formattedYesterday);

  

  const fetchData = async () => {
    try {

      const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/report/sales-by-date?startDate=${formattedYesterday}&endDate=${formattedToday}`
      );
      setSalesData(response?.data);
      
      
  } catch (err) {
      console.log(err);
  }
  }

  useEffect(() => {
    fetchData();
  }, []);

  let percentageTotalSales;
  let percentageTotalQuantity;
  let percentageTotalTransactions;

  if (salesData) {
    salesData?.sort((a, b) => new Date(a.saleDate) - new Date(b.saleDate));

// Calculate percentage change for each metric
const percentageChanges = {
  totalSales: calculatePercentageChange(salesData[1]?.totalSales, salesData[0]?.totalSales),
  totalQuantity: calculatePercentageChange(salesData[1]?.totalQuantity, salesData[0]?.totalQuantity),
  totalTransactions: calculatePercentageChange(salesData[1]?.totalTransactions, salesData[0]?.totalTransactions)
};

function calculatePercentageChange(currentValue, previousValue) {
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

console.log('Percentage Change in Total Sales:', percentageChanges.totalSales.toFixed(2) + '%');
percentageTotalSales = percentageChanges.totalSales.toFixed(2) + '%';
console.log('Percentage Change in Total Quantity:', percentageChanges.totalQuantity.toFixed(2) + '%');
percentageTotalQuantity = percentageChanges.totalQuantity.toFixed(2) + '%'
console.log('Percentage Change in Total Transactions:', percentageChanges.totalTransactions.toFixed(2) + '%');
percentageTotalTransactions = percentageChanges.totalTransactions.toFixed(2) + '%'
  }
  console.log(salesData);

  
  
  const addNewCategory = async () => {
      try {
        await axios.post(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/add-category`, {
                category: newCategory
            },
        );
        
        alert("Success")
        onClose()
        window.location.reload();
      } catch (err) {
          console.log(err);
          
      }
  }

  console.log((selectedCategory));
  

  const confirmDeleteCategory = async () => {
      try {
        await axios.delete(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/remove-category/${selectedCategory.id}`)

            alert("delete category successful")
            onClose()
            window.location.reload();
      } catch (err) {
          alert("category used in another data")
      }
  }

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
      exportToPDF
    }
  }, [salesData]);
  
  const exportToPDF = () => {
    if (salesData) {
      const docDefinition = {
        content: [
          { text: 'Product List', style: 'header' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['ID', 'Name', 'Price', 'Description', 'Status', 'Quantity', 'Created At', 'Updated At'],
                ...salesData.products.map((product) => [
                  product.id,
                  product.name,
                  formatPriceToIDR(product.price),
                  product.description,
                  product.status,
                  product.quantity,
                  new Date(product.created_at).toLocaleString(),
                  new Date(product.updated_at).toLocaleString(),
                ]),
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
          },
        },
      };

      pdfMake.createPdf(docDefinition).download('product_list.pdf');
    }
  };

  const fetchCategory = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/category-lists`
        );

        setDataCategory(response?.data)
    } catch (err) {
        console.log(err);
    }
}

console.log(dataCategory);


useEffect(() => {
    fetchCategory();
}, [])


const labels = salesData.map(item => item.saleDate);
const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Total Sales',
      data: salesData.map(item => item.totalSales),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      fill: true,
      label: 'Total Products',
      data: salesData.map(item => item.totalQuantity),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      fill: true,
      label: 'Total Transactions',
      data: salesData.map(item => item.totalTransactions),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};



  return (
      <>
        <SidebarWithHeader />
    <Box width='98.7vw' height='fit-content' backgroundColor='#fbfaf9' p='50px'>
        <Box pl='150px'>
  <HStack mb='10px'>
      <Text>Sale Today ({salesData[1]?.saleDate})</Text>
    <Spacer /> 
    <Button onClick={exportToPDF} borderRadius='full' border='solid 1px black' leftIcon={<IconArrowNarrowDown />}>Download</Button>
   </HStack>
   
   
   <Flex flexDirection='row' mt='10px' columnGap='10px'>
        <Box width='40%' p="20px" boxShadow='0px 1px 5px gray' borderRadius='10px'>
            <FormLabel>Revenue</FormLabel>
            <Heading mb='5px'>{formatPriceToIDR(salesData[1]?.totalSales)}</Heading>
            <HStack width='fit-content' borderRadius='full' p='10px' border= {percentageTotalSales > '0%' ? 'solid #06b300 3px' : 'solid #ff7c00 3px'} backgroundColor={percentageTotalSales > '0%' ? 'rgba(9, 255, 0, 0.75)' : 'rgba(255, 150, 0, 0.75)'} >
              <Box textColor= {percentageTotalSales > '0%' ? '#059900' : '#ff7200'}><IconGraphFilled /></Box>
              <Text>{percentageTotalSales}</Text>
            </HStack>
        </Box>
        <Box width='30%' p="20px" boxShadow='0px 1px 5px gray' borderRadius='10px'>
        <FormLabel>Products Sold</FormLabel>
        <Heading mb='5px'>{salesData[1]?.totalQuantity}</Heading>
        <HStack width='fit-content' borderRadius='full' p='10px' border= {percentageTotalQuantity > '0%' ? 'solid #06b300 3px' : 'solid #ff7c00 3px'} backgroundColor={percentageTotalQuantity > '0%' ? 'rgba(9, 255, 0, 0.75)' : 'rgba(255, 150, 0, 0.75)'}  textColor='black'>
              <Box textColor= {percentageTotalQuantity > '0%' ? '#059900' : '#ff7200'}><IconGraphFilled /></Box>
              <Text>{percentageTotalQuantity}</Text>
            </HStack>
        </Box>
        <Box width='30%' p="20px" boxShadow='0px 1px 5px gray' borderRadius='10px'>
        <FormLabel>Transactions</FormLabel>
        <Heading mb='5px'>{salesData[1]?.totalTransactions}</Heading>
        <HStack width='fit-content' borderRadius='full' p='10px' border= {percentageTotalTransactions > '0%' ? 'solid #06b300 3px' : 'solid #ff7c00 3px'} backgroundColor={percentageTotalTransactions > '0%' ? 'rgba(9, 255, 0, 0.75)' : 'rgba(255, 150, 0, 0.75)'}  textColor='black'>
              <Box textColor= {percentageTotalTransactions > '0%' ? '#059900' : '#ff7200'}><IconGraphFilled /></Box>
              <Text>{percentageTotalTransactions}</Text>
            </HStack>
        </Box>
    </Flex>
    <Box width='50vw'>
    <Line options={options} data={{ labels, datasets: [data.datasets[0]] }} />
    <Line options={options} data={{ labels, datasets: [data.datasets[1]] }} />
    <Line options={options} data={{ labels, datasets: [data.datasets[2]] }} />
  </Box>
        </Box>
    </Box>
    
    </>
  )
}

export {DashboardAdmin}