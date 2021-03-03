import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import api from '../Api'

const Home = () => {
    const history = useHistory();
    const [ enteredUser, setEnteredUser ] = useState('');
    const [ enteredPass, setEnteredPass ] = useState('');
    const [ isValid, setIsValid ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState('');

    async function handleSubmit() {
        try {
            if (!enteredUser.length || !enteredPass.length)  {
                setIsValid(false);
                setErrorMessage('Preencha os campos corretamente');
                return;
            }

            const res = await api.post('/login', {
                username: enteredUser,
                password: enteredPass
            });

            localStorage.setItem( 'token', res.data);
            api.defaults.headers.common['Authorization'] = res.data;
            history.push("/carteira");
        } catch (error) {
            setIsValid(false);
            setErrorMessage(error.response.data.message);
            console.log(error);
        }
    }

    return(
        <Container style={{ padding: 15, margin: 'auto', maxWidth: 400 }}>
            <Paper style={{ padding: 16 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h4' align='center' component='h1'>Mamaco</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='Usuário'
                            variant='outlined'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setEnteredUser(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='Digite a sua senha'
                            type='password'
                            variant='outlined'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e => setEnteredPass(e.target.value)}
                        />
                    </Grid>

                    { !isValid && 
                        <Grid item xs={12}>
                            <Typography color='error'>{errorMessage}</Typography>
                        </Grid>
                    }

                    <Grid item xs={12}>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={handleSubmit}
                        >
                            Entrar
                        </Button>
                    </Grid>
                </Grid>        
            </Paper>
        </Container>
    )
}

export default Home;