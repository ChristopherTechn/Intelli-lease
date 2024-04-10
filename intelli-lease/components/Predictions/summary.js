import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';



const Summary = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.column1}</Text>
      <Text style={styles.cell}>{item.column2}</Text>
    </View>
  );


  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom:25
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'green',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    marginLeft: '7%'
  },
});

export default Summary;
