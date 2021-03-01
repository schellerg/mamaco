import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import api from '../Api'
import { Button, Heading, Input, SimpleGrid, Stack, Text } from '@chakra-ui/react'

const Home = () => {
    const history = useHistory();
    const [ enteredUser, setEnteredUser ] = useState();
    const [ enteredPass, setEnteredPass ] = useState();
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
            // setErrorMessage(error.response.data.message);
            console.log(error);
        }
    }

    return(
        <SimpleGrid maxChildWidth='410px'>
            <Stack spacing={3}>
                <Heading textAlign='center' textTransform='uppercase'>Mamaco</Heading>
                <Input placeholder='Ex: kingkong' size='md' onChange={e => setEnteredUser(e.target.value)} />
                <Input placeholder='Digite a sua senha' size='md'  type='password' onChange={e => setEnteredPass(e.target.value)} />
                { !isValid && 
                    <Text fontSize='md' colorScheme='red'>{errorMessage}</Text>
                }
                <Button onClick={handleSubmit}>Entrar</Button>
            </Stack>
        </SimpleGrid>
    )
}

export default Home;