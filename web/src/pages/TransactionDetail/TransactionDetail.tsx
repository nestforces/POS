import { Box, Button, HStack, Icon, Input, InputGroup, InputLeftAddon, InputLeftElement, Spacer, Text, Image, IconButton, Card, CardBody, Stack, Heading, Divider, CardFooter, ButtonGroup, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, VStack, Flex, FormLabel, Checkbox, Textarea } from "@chakra-ui/react"
import { IconPlus, IconArrowLeft, IconPhotoUp, IconX, IconArrowRight } from '@tabler/icons-react'
import { ChangeEvent, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'
import { FiUpload } from "react-icons/fi"
import { useFormik } from "formik";

function formatPriceToIDR(price: number) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}

function formatISODate(isoDateString) {
  const date = new Date(isoDateString);

  // Format date and time in a readable way
  const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return formattedDateTime;
}

function capitalizeFirstLetter(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // return the unchanged string if it's undefined
}

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  console.log("ini", transactionId);
  

  const fetchData = async () => {
      try {
          const response = await axios.get(
              `${import.meta.env.VITE_APP_API_BASE_URL}/report/products-by-transaction/${transactionId}`
          );
          console.log("ini di fetch data", response);
          
          setData(response?.data)
      } catch (err) {
          console.log(err);
      }
  }

  useEffect(() => {
      fetchData();
  }, [])

  console.log("ini data", data);
  

  return (
      <>
        <SidebarWithHeader />
    <Box width='98.7vw' height='fit-content' backgroundColor='#fbfaf9' p='50px'>
        <HStack ml={{md: '150px', sm: '0px'}} mb='10px'>
    <Button leftIcon={<IconArrowLeft />} borderRadius='full' backgroundColor='white' textColor='black' border='solid 1px black' onClick={() => navigate('/report')}>Back</Button>
    <Spacer />
        </HStack>
        <Box ml={{md: '150px', sm: '0px'}} borderRadius='10px' p='20px' backgroundColor='white' boxShadow='0px 1px 5px gray'>
        <Flex flexDir={{md: 'row', sm: 'column'}} columnGap='10px' mb='20px '>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Transaction Information</Text>
            <FormLabel>Total Quantity</FormLabel>
            <Text>{data[0]?.total_quantity}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Total Payment</FormLabel>
            <Text>{formatPriceToIDR(data[0]?.total_price)}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Date</FormLabel>
            <Text>{formatISODate(data[0]?.date)}</Text>
            </Box>
        </Flex>
        <Text fontSize='large' fontWeight='bold' mb='5px'>Transaction Item</Text>
        {data[0]?.transaction_item?.map((item) => (
          <Flex flexDir={{md: 'row', sm: 'column'}} columnGap='10px' mb='10px '>
            <Box width='50%'>
              <Image
            src={`http://localhost:8080/uploads/products/${item.product.image}`}
            alt={`${item.product.name}`}
            boxSize="100px"
            objectFit="cover"
            borderRadius="10px"/> 
            </Box>
          <Box width='50%'>
          <FormLabel>Product Name</FormLabel>
          <Text>{item.product.name}</Text>
          </Box>
          <Box width='50%'>
          <FormLabel>Quantity</FormLabel>
          <Text>{item.total_quantity}</Text>
          </Box>
          <Box width='50%'>
          <FormLabel>Price / pcs</FormLabel>
          <Text>{formatPriceToIDR(item.product.price)}</Text>
          </Box>
      </Flex>
        ))}
        <Text fontSize='large' fontWeight='bold'>Cashier Information</Text>
        <HStack>
          <Image
            src={`http://localhost:8080/uploads/avatar/${data[0]?.cashier?.avatar}`}
            // src='https://tse3.mm.bing.net/th?id=OIP.pi83Xrt5Xqa_A6F5TOqBxwHaEK&pid=Api&P=0&h=180'
            alt={`${data[0]?.cashier?.username}`}
            boxSize="100px"
            objectFit="cover"
            borderRadius="full"/>
          <FormLabel fontSize='20px'>{data[0]?.cashier?.username}</FormLabel>
          </HStack>        
  
        </Box>
    </Box>
    </>
  )
}

export {TransactionDetail}