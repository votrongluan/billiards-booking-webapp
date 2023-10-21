import React, {useEffect, useState} from 'react';
import {HStack, Input, InputGroup, InputLeftElement, Select, Spacer, Text} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";

function SearchFilter({data, methods, DisplayData}) {
    const normalize = (text) => {
        return text
            .normalize('NFKD')
            .replace(/[\u0300-\u036F]/g, '')
            .replace(/đ/g, 'd');
    };

    const [filteredData, setFilteredData] = useState(data);
    const [search, setSearch] = useState("");
    const [sortMethod, setSortMethod] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const sortData = (dataNeedSortedByMethod) => {
        let filtered = [...dataNeedSortedByMethod];

        filtered.sort((a, b) => {
            if (sortMethod) {
                if (typeof a[sortMethod] === "number") {
                    if (sortOrder === "asc") {
                        return a[sortMethod] - b[sortMethod];
                    } else {
                        return b[sortMethod] - a[sortMethod];
                    }
                }

                const valueA = a[sortMethod].toString();
                const valueB = b[sortMethod].toString();

                if (sortOrder === "asc") {
                    return valueA.localeCompare(valueB);
                } else {
                    return valueB.localeCompare(valueA);
                }
            }
        });

        return filtered;
    };

    const filtersData = (query) => {
        query = normalize(query.toLowerCase()); // Normalize and convert to lowercase

        return data.filter((el) => {
            return Object.values(el).some((field) => {
                const normalizedFieldData = normalize(field.toString().toLowerCase());
                return normalizedFieldData.includes(query);
            });
        });
    };

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
    };

    useEffect(() => {
        const dataAfterFilterBySearch = filtersData(search);
        const sortedData = sortData(dataAfterFilterBySearch);
        setFilteredData(sortedData)
    }, [sortMethod, sortOrder, search]);

    return (
        <>
            <InputGroup my={5}>
                <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300"/>}
                />
                <Input
                    bgColor="white"
                    type="text"
                    placeholder="Tìm kiếm"
                    value={search}
                    onChange={handleSearchChange}
                />
            </InputGroup>

            <HStack mb={10}>
                <Spacer/>

                <Select
                    bgColor="white"
                    maxW="200px"
                    placeholder="Sắp xếp theo"
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value)}
                >
                    {methods.map((method) => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                </Select>

                <Select
                    bgColor="white"
                    maxW="150px"
                    placeholder="Thứ tự"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Tăng dần</option>
                    <option value="desc">Giảm dần</option>
                </Select>
            </HStack>

            <Text color="gray.500" mb={5}>Tìm thấy {filteredData.length} kết quả</Text>

            <DisplayData filteredData={filteredData}/>
        </>
    );
}

export default SearchFilter;