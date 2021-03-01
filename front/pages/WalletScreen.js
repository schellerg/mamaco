import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Datepicker, IndexPath, Input, Layout, List, ListItem, Select, SelectItem, Tab, TabBar, Text } from '@ui-kitten/components';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { cos } from 'react-native-reanimated';

const Wallet = () => {
  const minYear = new Date(1998,0,1);
  const now = new Date();
  const [ investType, setInvestType ] = useState(new IndexPath(0));
  const [ investValue, setInvestValue] = useState();
  const [ investDate, setInvestDate] = useState(now);
  const [ selectedTab, setSelectedTab ] = useState(0);
  const [ investments, setInvestments ] = useState([]);

  async function readToken() {
    try {
      const credentials = await SecureStore.getItemAsync('jwt');
      return credentials;
    } catch (error) {
      console.log(error);
    }
  }

  // Load user's investments
  useEffect(() => {
    const listInvestments =  async () => {
      try {
        const token = await readToken();
        const res = await api.get('/investment', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInvestments(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    listInvestments();
  }, []);

  async function addInvest() {
    try {
      const res = await api.post('/investment', {
        type: investType,
        value: investValue,
        date: investDate
      });
    } catch (error) {
      setIsValid(false);
      setErrMessage(error.response.data.message);
    }
  }

  const listItem = ({ item }) => {
    console.log('ava', item);
    <ListItem
      title={item.date}
      description={item.value}
    />
  }

  return (
    <ScrollView>
      <Layout level='1'>
        <Select
          label='Adicionar novo investimento'
          placeholder='Tipo'
          selectedIndex={investType}
          onSelect={investType => setInvestType(investType)}>
          <SelectItem title='Renda Fixa' />
          <SelectItem title='Renda Variável' />
        </Select>

        <Input
          blurOnSubmit
          placeholder='Valor'
          onChangeText={investValue => setInvestValue(investValue)}
        />
      </Layout>

      <Layout level='1'>
        <Datepicker
          date={investDate}
          min={minYear}
          max={now}
          placeholder='Data de compra'
          onSelect={nextDate => setInvestDate(nextDate)}
        />
        <Button status='primary' onPress={() => addInvest() }>+</Button>
      </Layout>

      <Layout level='1'>
        <TabBar
          selectedIndex={selectedTab}
          onSelect={selectedTab => setSelectedTab(selectedTab)}>
          <Tab title='Renda fixa'>
            <List
              data={investments}
              renderItem={listItem}
            />
          </Tab>
          <Tab title='Renda variável'></Tab>
        </TabBar>
      </Layout>
    </ScrollView>
  )
}

export default Wallet;