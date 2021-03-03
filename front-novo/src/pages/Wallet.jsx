import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { Chart } from "react-google-charts";
import { List, ListItem, ListItemText, TextField, Container, Paper, Grid, Typography, ListItemAvatar, ListItemSecondaryAction, IconButton, Select, FormControl, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import api from '../Api';

const Wallet = () => {
    const history = useHistory();
    const today = format(new Date(), 'yyyy-MM-dd');
    const [ count, setAmount ] = useState(0);
    const [ investments, setInvestments ] = useState({ rendaVariavel: [], rendaFixa: [] });
    const [ insertedType, setInsertedType ] = useState(0);
    const [ insertedValue, setInsertedValue] = useState(0);
    const [ insertedDate, setInsertedDate ] = useState(today);
    const [ overview, setOverview ]  = useState({ total: 0, rendaVariavel: [], rendaFixa: [] });
    const [ isValid, setValid ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem( 'token');

        if (!token) {
            history.push("/login");
            return;
        }

        api.defaults.headers.common['Authorization'] = token;
        listInvestments();
        listOverview();
    }, []);

    useEffect(() => {
        listInvestments();
        listOverview();
    }, [count]);

    // Load user investments
    async function listInvestments() {
        try {
            const res = await api.get('/investments');
            setInvestments(res.data);
        } catch (error) {
            if (error.response.status === 403) {
                history.push("/login");
            }
        }
    }

    // Add user investment
    async function handleSubmit() {
        debugger;
        try {
            if (insertedType === '0') {
                setValid(false);
                return;
            }

            if (parseInt(insertedValue) === 0) {
                setValid(false);
                return;
            }

            // Clear error messages
            setValid(true);

            await api.post('/investments', {
                type: insertedType,
                value: insertedValue,
                date: insertedDate
            });

            setAmount(count + 1);
        } catch (error) {
            console.log(error);
        }
    };

    // Delete user investment
    async function deleteInvestment(id) {
        try {
            await api.delete(`/investments/${id}`);
            setAmount(count - 1);
        } catch (error) {
            console.log(error);
        }
    }

    // List user's investments overview
    async function listOverview() {
        try {
            const res = await api.get('/investments/overview');
            setOverview(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Investments list component
    function StockList(props) {
        const items = props.items;

        const StockList = items.map((item) => 
                <ListItem key={item.id.toString()}>
                    <ListItemAvatar>
                        <MonetizationOnOutlinedIcon />
                    </ListItemAvatar>
                    <ListItemText
                        primary={(new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(item.value)) }
                        secondary={ (new Date(item.date).toLocaleDateString()) }
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge='end' aria-label='Apagar' id={item.id} onClick={() => deleteInvestment(item.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
        );

        return (
            <List>
                {StockList}
            </List>
        );
    }

    return (
        <Container style={{ padding: 15, margin: 'auto', maxWidth: 1200 }}>
            <Paper style={{ padding: 15 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ marginBottom: 30 }}>
                        <Typography align='center' variant='h4'>Carteira de Investimentos</Typography>
                    </Grid>

                    <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body2'>Adicionar novo investimento:</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                label='Tipo'
                                native
                                value={insertedType}
                                variant='outlined'
                                onChange={e => setInsertedType(e.target.value)}
                            >
                                <option value='0'></option>
                                <option value='RENDA_FIXA'>Renda Fixa</option>
                                <option value='RENDA_VARIAVEL'>Renda Variável</option>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label='Valor'
                            min={0}
                            type='number'
                            value={insertedValue}
                            variant='outlined'
                            inputProps={{
                                min: 0,
                                max: 10,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setInsertedValue(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            defaultValue={today}
                            fullWidth
                            label='Data de compra'
                            type='date'
                            variant='outlined'
                            inputProps={{
                                max: today
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={e => setInsertedDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color='primary'
                            variant='contained'
                            onClick={handleSubmit}
                        >
                            <AddIcon />
                        </IconButton>
                    </Grid>

                    { !isValid ?
                        <Grid item xs={12}>
                            <Typography align='center' color='error'>Preencha os campos corretamente</Typography>
                        </Grid> : null
                    }
                </Grid>
            </Paper>

            <Paper style={{ padding: 15, marginTop: 30 }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant='h6'>Renda Fixa</Typography>
                        <StockList items={investments.rendaFixa} type='RENDA_FIXA' />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant='h6'>Renda Variável</Typography>
                        <StockList items={investments.rendaVariavel} type='RENDA_VARIAVEL' />
                    </Grid>
                </Grid>
            </Paper>

            <Paper style={{ padding: 15, marginTop: 30 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography align='center' variant='h5'>Resumo da Carteira</Typography>
                    </Grid>

                    <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography align='center'>{overview.rendaFixa.percentage}% da carteira em renda fixa</Typography>
                        <Typography align='center'>{overview.rendaVariavel.percentage}% da carteira em renda variável</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Chart
                            width={'500px'}
                            height={'300px'}
                            chartType='PieChart'
                            loader={<div>Carregando...</div>}
                            data={[
                                [ 'Renda', 'Total'],
                                [ 'Fixa', overview.rendaFixa.total ],
                                [ 'Variável', overview.rendaVariavel.total ]
                              ]}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Wallet;