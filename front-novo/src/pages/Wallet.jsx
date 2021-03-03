import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, List, ListItem, ListItemText, TextField, Container, Paper, Grid, Typography, MenuItem, Icon, ListItemAvatar, ListItemSecondaryAction, IconButton, Select, FormControl, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import api from '../Api';

const Wallet = () => {
    const history = useHistory();
    const today = format(new Date(), 'yyyy-MM-dd');
    const [ count, setAmount ] = useState(0);
    const [ investments, setInvestments ] = useState({ rendaVariavel: [], rendaFixa: []});
    const [ insertedType, setInsertedType ] = useState(0);
    const [ insertedValue, setInsertedValue] = useState(0);
    const [ insertedDate, setInsertedDate ] = useState(today);
    const [ isValid, setValid ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem( 'token');

        if (!token) {
            history.push("/login");
            return;
        }

        api.defaults.headers.common['Authorization'] = token;
        listInvestments();
    }, []);

    useEffect(() => {
        listInvestments();
    }, [count]);

    // Load user investments
    async function listInvestments() {
        try {
            const res = await api.get('/investments');
            setInvestments(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Add user investment
    async function handleSubmit() {
        debugger;
        console.log(today);
        try {
            if (insertedType === 0 && insertedValue === 0) {
                setValid(false);
                return;
            }

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

    // Investments list component
    function StockList(props) {
        const items = props.items;
        console.log(items);

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
                                <option value="RENDA_FIXA">Renda Fixa</option>
                                <option value="RENDA_VARIVAEL">Renda Variável</option>
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
                            size='large'
                            variant='contained'
                            onClick={handleSubmit}
                        >
                            <AddIcon />
                        </IconButton>
                    </Grid>

                    { !isValid ?
                        <Grid item xs={12}>
                            <Typography align='center'>Preencha os campos corretamente</Typography>
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

                    <Grid item xs={6}>
                        x% da carteira em renda fixa
                        y% da carteira em renda variável
                    </Grid>

                    <Grid item xs={6}>
                        Gráfico aqui
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Wallet;