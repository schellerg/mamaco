import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Button, Datepicker, IndexPath, Input, Layout, Select, SelectItem, Tab, TabBar, Text } from '@ui-kitten/components';

const Wallet = () => {
  const minYear = new Date(1998,0,1);
  const now = new Date();
  const [ investType, setInvestType ] = useState(new IndexPath(0));
  const [ investValue, setInvestValue] = useState();
  const [ investDate, setInvestDate] = useState(now);
  const [ selectedTab, setSelectedTab ] = useState(0);

  const investimentos = [
    {
      type: 'Renda Fixa',
      date: '27-02-2021',
      value: '3500'
    },
    {
      type: 'Renda Fixa',
      date: '27-02-2021',
      value: '10000'
    }
  ];

  async function addInvest() {
    try {
      const res = await api.post('/investment', {
        type: investType,
        value: investValue,
        date: date
      });
    } catch (error) {
      setIsValid(false);
      setErrMessage(error.response.data.message);
    }
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
          <Tab title='Renda fixa'></Tab>
          <Tab title='Renda variável'></Tab>
        </TabBar>
      </Layout>
    </ScrollView>
  )
}

export default Wallet;