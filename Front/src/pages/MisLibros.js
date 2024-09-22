import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Calendar } from 'react-native-calendars'; 

const { width } = Dimensions.get('window');

const books = [
    { title: 'Harry Potter and the Half Blood Prince', author: 'JK Rowling', chapters: 12, pages: 58, time: '57 mins', image: require('../img/ju.png'), description: 'A long description of the book...', daysRemaining: 5 },
    { title: 'Sukuna Kaisen', author: 'Author 2', chapters: 10, pages: 120, time: '1 hour', disponibilidad: 'Disponible', image: require('../img/ju.png'), description: 'Este hogar apoya a papi Sukuna como futuro ganador del combate contra Go/Yo e Itadori', daysRemaining: 10 },
    { title: 'Book 3', author: 'Author 3', chapters: 15, pages: 200, time: '2 hours', disponibilidad: 'No disponible', image: require('../img/ju.png'), description: 'Yet another description...', daysRemaining: 0 },
  ];


const MisLibros = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const generateMarkedDates = (books) => {
    const newMarkedDates = {};
    books.forEach(book => {
      const endDate = new Date(book.startDate);
      endDate.setDate(endDate.getDate() + book.daysRemaining);

      const currentDate = new Date(book.startDate);
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        newMarkedDates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: '#ffcc00', 
              borderRadius: 15, 
            },
            text: {
              color: 'white', 
              fontWeight: 'bold',
            },
          },
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return newMarkedDates;
  };

  const onDayPress = (day) => {
    const newMarkedDates = { ...markedDates, [day.dateString]: { marked: true, dotColor: 'green' } };
    setMarkedDates(newMarkedDates);
  };

  useEffect(() => {
    const dates = generateMarkedDates(books);
    setMarkedDates(dates);
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={'custom'}
            theme={{
              arrowColor: '#ff6666', 
              monthTextColor: '#', 
              dayTextColor: '#000000',
              backgroundColor: '#000000', 
              textDisabledColor: '#d9d9d9', 
              textDayFontWeight: 'bold',
              'stylesheet.calendar.header': {
                week: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
                day: {
                  margin: 1,
                  padding: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
            }}
          />
        </View>

        <View style={styles.welcomeMessageContainer}>
          <Text style={styles.welcomeText}>Estos son tus libros</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Qué buscas hoy"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.tarjetasText}>Mis libros</Text>

        <View style={styles.tarjetasContainer}>
          {books.map((book, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tarjeta}
              onPress={() => navigation.navigate('DetallesLibro', { book })}
            >
              <Image source={book.image} style={styles.bookImage} />
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.daysRemainingText}>Devolver en: {book.daysRemaining} días</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#ffb3b3', 
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  welcomeMessageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  tarjetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tarjeta: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
  },
  bookTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tarjetasText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysRemainingText: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
});

export default MisLibros;
