import React, {useContext, useRef} from 'react';
import {baseURL} from "../../api/axios.js";
import {useLoaderData} from "react-router-dom";
import {GlobalContext} from "../../context/GlobalContext.jsx";
import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import SearchFilter from "../../components/SearchFilter.jsx";

function ClubTable(props) {
    const tables = useLoaderData();
    const {tableTypeMap} = useContext(GlobalContext);

    tables.forEach((table) => {
        table.type = tableTypeMap[table.tableTypeId];
    })

    // Modal
    const {isOpen, onOpen, onClose} = useDisclosure()
    const initialRef = useRef(null)

    return (
        <>
            <Heading as="h2" size="lg" textAlign="center">Quản lý bàn</Heading>
            <HStack>
                <Spacer/>
                <Button colorScheme="telegram" onClick={onOpen}>Cập nhật</Button>
            </HStack>
            <SearchFilter data={tables} methods={[
                {value: 'type', label: 'Loại bàn'}
            ]} DisplayData={
                ({filteredData}) => (
                    <TableContainer bgColor="white" borderRadius="4px">
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Mã bàn</Th>
                                    <Th>Loại bàn</Th>
                                    <Th textAlign="center">Thao tác</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredData.map((table) => (
                                    <Tr key={table.id}>
                                        <Td>
                                            <Text>{table.id}</Text>
                                        </Td>
                                        <Td>
                                            <Text>{tableTypeMap[table.tableTypeId]}</Text>
                                        </Td>
                                        <Td textAlign="center">
                                            <Button colorScheme="red">Xóa</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }/>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Cập nhật thông tin về giá</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);

                            console.log(data);
                        }}>
                            <FormControl isRequired>
                                <FormLabel>Số lượng</FormLabel>
                                <Input name="price" type="number" ref={initialRef}
                                       placeholder='Nhập số lượng bàn cần thêm'/>
                            </FormControl>

                            <FormControl isRequired mt={4}>
                                <FormLabel>Loại bàn</FormLabel>
                                <Select name="tableTypeId">
                                    {Object.entries(tableTypeMap).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </Select>
                            </FormControl>

                            <HStack mt={10}>
                                <Spacer/>
                                <Button colorScheme='blue' mr={3} type="submit">
                                    Xác nhận
                                </Button>
                                <Button onClick={onClose}>Hủy</Button>
                            </HStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ClubTable;

export const tableLoader = async ({params}) => {
    const {id} = params;

    const res = await fetch(baseURL + '/tableClubOne')

    if (!res.ok) {
        throw Error('Không tìm thấy club')
    }

    return res.json()
}