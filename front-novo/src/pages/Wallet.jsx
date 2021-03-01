import React from 'react';
import { AddIcon } from '@chakra-ui/icons'
import { Box, Container, Heading, IconButton, NumberInput, NumberInputField, Select, SimpleGrid, Stat, StatHelpText, StatNumber, Text } from '@chakra-ui/react'

const Wallet = () => {
    return (
        <Container maxW='container.lg'>
            <Heading textAlign='center'>Carteira de Investimentos</Heading>
            <SimpleGrid minChildWidth='20px' spacingX='15px'>
                <Text>Adicionar novo investimento:</Text>
                <Select placeholder='Tipo'>
                    <option value=''>Renda Fixa</option>
                    <option value=''>Renda Variável</option>
                </Select>
                <NumberInput>
                    <NumberInputField placeholder='Valor' />
                </NumberInput>

                <IconButton aria-label='Adicionar investimento' icon={<AddIcon />} />
            </SimpleGrid>

            <SimpleGrid columns={2}>
                <Box>
                    <Heading>Renda Fixa</Heading>
                    <Stat>
                        <StatNumber>R$500,00</StatNumber>
                        <StatHelpText>28/02/2021</StatHelpText>
                    </Stat>
                </Box>
                <Box>
                    <Heading>Renda Variável</Heading>
                    <Stat>
                        <StatNumber>R$500,00</StatNumber>
                        <StatHelpText>28/02/2021</StatHelpText>
                    </Stat>
                </Box>
            </SimpleGrid>
        </Container>
    )
}

export default Wallet;