import React, { useEffect, useState } from 'react';
import { Button, List, ListItem, ListItemText, TextField, Container, Paper, Grid, Typography, MenuItem, Icon, ListItemAvatar, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import api from '../Api';

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
                <ListItem key={index.toString()}>
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
                        <IconButton edge='end' aria-label='Apagar'>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem> : null
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

                    <Grid item xs={2}>
                        <Typography variant='body2'>Adicionar novo investimento:</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label='Tipo'
                            select
                            variant='outlined'
                            onChange={e => setInsertedType(e.target.value)}
                        >
                            <MenuItem key="RENDA_FIXA">Renda Fixa</MenuItem>
                            <MenuItem key="RENDA_VARIVAEL">Renda Variável</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label='Valor'
                            type='number'
                            variant='outlined'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setInsertedValue(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label='Data de compra'
                            type='date'
                            variant='outlined'
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <Button
                            color='primary'
                            size='large'
                            startIcon={<AddIcon />}
                            variant='contained'
                            onClick={handleSubmit}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper style={{ padding: 15, marginTop: 30 }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant='h6'>Renda Fixa</Typography>
                        <StockList items={investments} type='RENDA_FIXA' />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant='h6'>Renda Fixa</Typography>
                        <StockList items={investments} type='RENDA_VARIAVEL' />
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