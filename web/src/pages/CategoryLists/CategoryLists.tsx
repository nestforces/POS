import { Box, Button, HStack, Input, Spacer, Text, IconButton, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, VStack, useColorModeValue, Select, FormLabel } from "@chakra-ui/react"
import {  IconPlus, IconEditCircle, IconTrashX } from '@tabler/icons-react'
import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

const CategoryLists = () => {
  const [data, setData] = useState<ApiResponse | null>([]);
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("")
  const [editCategory, setEditCategory] = useState("")


  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&categoryId=${categoryId}&productName=${productName}`
      );
      setData(response?.data);
      
      
  } catch (err) {
      console.log(err);
  }
  }

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortField, sortOrder, categoryId, productName]);

  console.log(data);

  const handleSortOrder = (order: string) => {
    setSortOrder(order);
    // onClose();
  };

  const handleSortField = (order: string) => {
    setSortField(order);
    // onClose();
  };

  const handleProductName = (value: string) => {
    setProductName(value);
    setPage(1);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  }
  
  
  const addNewCategory = async () => {
      try {
        await axios.post(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/add-category`, {
                category: newCategory
            },
        );
        
        alert("Success")
        onClose()
        fetchCategory()
      } catch (err) {
          console.log(err);
          
      }
  }

  console.log((selectedCategory));
  

  const confirmEditCategory = async () => {
    try {
      await axios.patch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products/edit-category`, {
            category_id: selectedCategory?.id,
            categoryNew: editCategory
          })

          alert("Edit category successful")
          onClose()
          fetchCategory();
    } catch (err) {
        alert("error")
    }
}

  const confirmDeleteCategory = async () => {
      try {
        await axios.delete(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/remove-category/${selectedCategory.id}`)

            alert("delete category successful")
            onClose()
            fetchCategory();
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
    if (data) {
      // Call exportToPDF here, as data is now updated
      exportToPDF
    }
  }, [data]);
  
  const exportToPDF = () => {
    if (data) {
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
                ...data.products.map((product) => [
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



  return (
      <>
        <SidebarWithHeader />
    <Box width='98.7vw' height='fit-content' backgroundColor='#fbfaf9' p='50px'>
        <Box pl={{md: '150px', sm: '0px'}}>
  <HStack mb='10px'>
    <Button leftIcon={<IconPlus />} backgroundColor='#286043' textColor='white' border='solid 1px #286043' onClick={onOpen}>Add Category</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Category Name</FormLabel>
            <Input border='solid black 1px' name='newCategory' value={newCategory} onChange={(e) => setNewCategory(e.target.value)} type='text'></Input>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='green' mr={3} onClick={addNewCategory}>
              Add Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <Spacer /> 
    {/* <Button onClick={exportToPDF} borderRadius='full' border='solid 1px black' leftIcon={<IconArrowNarrowDown />}>Download</Button> */}
   
  </HStack>
  <Box p="20px" boxShadow='0px 1px 5px gray'><HStack mb='5px'>
  <Text fontWeight='bold'>Category Name</Text>
  <Spacer /> 
  <Text fontWeight='bold' mr='10px'>Action</Text>
</HStack>
<Box as='hr' borderTopWidth='3px' borderTopColor='black.200'></Box>  
{dataCategory && dataCategory?.map((item, index) => (
                   <>
                   <HStack m='10px' >
                   <Text width='210px' isTruncated textOverflow='ellipsis' whiteSpace='nowrap' >{item?.category}</Text>
                   <Spacer />
                   <IconButton  icon={<IconEditCircle />} variant='ghost' colorScheme='blue' onClick={() => handleEditCategory(item)} />
                   <IconButton  icon={<IconTrashX />} variant='ghost' colorScheme='red' onClick={() => handleDeleteCategory(item)} />
                 </HStack>
                 <Box as='hr' borderTopWidth='1px' borderTopColor='black.200' />
                 </>
                  
            ))} </Box>
          
          
  {deleteModalOpen && (
  <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Delete Category</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          Are you sure you want to delete the category "{selectedCategory?.category}"?
        </Text>
        <VStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={() => setDeleteModalOpen(false)}>
          Cancel
        </Button>
        <Button colorScheme='red' onClick={confirmDeleteCategory}>
          Delete
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)}

{editModalOpen && (
  <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Edit Category {selectedCategory?.category}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      <FormLabel>New Category Name</FormLabel>
            <Input border='solid black 1px' name='editCategory' value={editCategory} onChange={(e) => setEditCategory(e.target.value)} type='text'></Input>
        <VStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={() => setEditModalOpen(false)}>
          Cancel
        </Button>
        <Button colorScheme='red' onClick={confirmEditCategory}>
          Edit
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)}

  
        </Box>
    </Box>
    </>
  )
}

export {CategoryLists}