import React, { Fragment, useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Container, FormControl, Heading, IconButton, NumberInput, NumberInputField, Select, SimpleGrid, Stat, StatHelpText, StatNumber, Text } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from  'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../Api';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ptBR', ptBR);

const Wallet = () => {
    const [ investments, setInvestments ] = useState([]);
    const [ insertedType, setInsertedType ] = useState(0);
    const [ insertedValue, setInsertedValue] = useState(0);
    const [ startDate, setStartDate ] = useState(new Date());

    // Load user investments
    useEffect(() => {
        const listInvestments = async () => {
            try {
                const res = await api.get('/investment');
                setInvestments(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        listInvestments();
    }, []);

    // Add user investment
    async function handleSubmit() {
        console.log(startDate);
        try {
            const offest = startDate.getTimezoneOffset();
            let formatedDate = new Date(startDate.getTime() - (offest * 60 * 1000));
            formatedDate = formatedDate.toISOString().split('T')[0];

            console.log(formatedDate);

            if (insertedType === 0 && insertedValue === 0) {
                return;
            }

            const res = await api.post('/investment', {
                type: insertedType,
                value: insertedValue,
                date: formatedDate
            });
        } catch (error) {
            
        }
    };

    function StockList(props) {
        const items = props.items;
        const type = props.type;

        const StockList = items.map((item, index) => 
            (type === item.type) ?
                <Stat key={index.toString()}>
                    <StatNumber>{
                        (new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(item.value)) }
                    </StatNumber>
                    <StatHelpText>{ (new Date(item.date).toLocaleDateString()) }</StatHelpText>
                </Stat> : null
        );

        return (
            <Fragment>
                {StockList}
            </Fragment>
        );
    }

    return (
        <Container maxW='container.lg'>
            <Heading textAlign='center'>Carteira de Investimentos</Heading>
            <SimpleGrid minChildWidth='20px' spacingX='15px'>
                <Text>Adicionar novo investimento:</Text>
                <Select placeholder='Tipo' onChange={e => setInsertedType(e.target.value)}>
                    <option value='RENDA_FIXA'>Renda Fixa</option>
                    <option value='RENDA_VARIAVEL'>Renda Variável</option>
                </Select>

                <NumberInput>
                    <NumberInputField maxLength={10} placeholder='Valor' onChange={e => setInsertedValue(e.target.value)} />
                </NumberInput>

                <FormControl>
                    <DatePicker
                        dateFormat='dd/MM/yyyy'
                        locale='ptBR'
                        maxDate={new Date()}
                        placeholderText='Data de compra'
                        startDate={startDate}
                        onChange={date => setStartDate(date)}
                    />
                </FormControl>

                <IconButton aria-label='Adicionar investimento' icon={<AddIcon />} onClick={handleSubmit} />
            </SimpleGrid>

            <SimpleGrid columns={2}>
                <Box>
                    <Heading>Renda Fixa</Heading>
                    <StockList items={investments} type='RENDA_FIXA' />
                </Box>
                <Box>
                    <Heading>Renda Variável</Heading>
                    <StockList items={investments} type='RENDA_VARIAVEL' />
                </Box>
            </SimpleGrid>

            <SimpleGrid columns={2}>
                <Heading>Resumo da Carteira</Heading>
                <Box>
                    x% da carteira em renda fixa
                    y% da carteira em renda variável
                </Box>
                <Box>
                    Gráfico aqui
                </Box>
            </SimpleGrid>
        </Container>
    );
}

export default Wallet;