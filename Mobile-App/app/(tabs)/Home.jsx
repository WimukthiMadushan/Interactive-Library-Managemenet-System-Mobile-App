import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from "axios";
import Filter from "../../components/Filter";
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("gallery");
  const [filterClicked, setFilterClicked] = useState(false);
  const [defaultBooks, setDefaultBooks] = useState([]);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [allCategory, setAllCategory] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://192.168.188.169:5001/api/book/list");
        setBooks(response.data);
        setDefaultBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.188.169:5001/api/category");
        setAllCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredBooks = books.filter(book =>
    book.Title && typeof book.Title === 'string' && book.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedRating(null);
    setStartDate('');
    setEndDate('');
    setBooks(defaultBooks);
    setFiltersApplied(false);
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '../Pages/BookDetails', params: { book: JSON.stringify(item) } })} style={styles.cardTouchable}>
      <View style={styles.card}>
        <Image source={{ uri: item.Image_Path }} style={styles.bookImage} />
        <Text style={styles.bookTitle}>{item.Title}</Text>
        <Text style={styles.bookAuthor}>{item.Author}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBookListItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '../Pages/BookDetails', params: { book: JSON.stringify(item) } })} style={styles.listItemTouchable}>
      <View style={styles.listItem}>
        <Image source={{ uri: item.Image_Path }} style={styles.listItemImage} />
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemTitle}>{item.Title}</Text>
          <Text style={styles.listItemAuthor}>{item.Author}</Text>
          <Text style={styles.listItemDescription}>{item.Description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.heading}>Home</Text>
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={18} color="gray" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <AntDesign name="closecircle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.filter,
            (filterClicked || filtersApplied) && styles.activeFilterButton
          ]}
          onPress={() => setFilterClicked(!filterClicked)}
        >
          {!filterClicked && !filtersApplied && (
            <MaterialCommunityIcons name="filter-outline" size={22} color="gray" />
          )}
          {(filterClicked || filtersApplied) && (
            <MaterialCommunityIcons name="filter-check-outline" size={22} color="black" />
          )}
          <Text style={[styles.filterText, (filterClicked || filtersApplied) && { color: "black" }]}>
            Filter
          </Text>
          {!filterClicked && (
            <MaterialIcons name="arrow-drop-down" size={24} color={filtersApplied === true ? "black" : "gray"} />
          )}
          {filterClicked && (
            <MaterialIcons name="arrow-drop-up" size={24} color="black" />
          )}
        </TouchableOpacity>
        <View style={styles.viewButtonsContainer}>
          <TouchableOpacity
            style={[styles.viewButton, view === "gallery" && styles.activeViewButton]}
            onPress={() => setView("gallery")}
          >
            <AntDesign name="appstore-o" size={15} color={view === "gallery" ? "black" : "gray"} />
            <Text style={[styles.viewButtonText, { color: view === "gallery" ? "black" : "gray" }]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, view === "list" && styles.activeViewButton]}
            onPress={() => setView("list")}
          >
            <Entypo name="list" size={18} color={view === "list" ? "black" : "gray"} />
            <Text style={[styles.viewButtonText, { color: view === "list" ? "black" : "gray" }]}>List</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Filter Dropdown */}
      {filterClicked && (
        <Filter
          setFilterClicked={setFilterClicked}
          booksSet={setBooks}
          defaultBooks={defaultBooks}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setFiltersApplied={setFiltersApplied}
          allCategory={allCategory}
        />
      )}
  
      {/* No Matches Message */}
      {filteredBooks.length === 0 ? (
        <View style={styles.noMatchesContainer}>
          <MaterialIcons name="error" size={50} color="black" />
          <Text style={styles.noMatchesTitle}>We're sorry</Text>
          <Text style={styles.noMatchesText}>We can not find any matches for your search term</Text>
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={view === "gallery" ? renderBookCard : renderBookListItem}
          keyExtractor={(item) => item.Book_ID.toString()}
          numColumns={view === "gallery" ? 2 : 1}
          key={view}
          contentContainerStyle={styles.bookList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    marginTop: 30,
    textAlign: "left",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 18,
    paddingRight: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  activeFilterButton: {
    backgroundColor: "lightgray",
  },
  filterText: {
    color: "gray",
    marginLeft: 5,
    marginRight: 5,
  },
  viewButtonsContainer: {
    flexDirection: "row",
  },
  viewButton: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  activeViewButton: {
    backgroundColor: "lightgray",
  },
  viewButtonText: {
    marginLeft: 5,
  },
  bookList: {
    paddingTop: 0,
  },
  cardTouchable: {
    flex: 1,
    margin: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  card: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookImage: {
    width: 125,
    height: 185,
    marginBottom: 10,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  listItemTouchable: {
    marginLeft: 2,
    marginRight: 2,
  },
  listItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 3,
  },
  listItemImage: {
    width: 75,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItemAuthor: {
    fontSize: 14,
    color: "gray",
  },
  listItemDescription: {
    fontSize: 12,
    color: "gray",
  },
noMatchesContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},
noMatchesText: {
  fontSize: 16,
  color: 'gray',
  textAlign: 'center',
  marginBottom: 10,
},
noMatchesTitle: {
  fontSize: 18,
  color: 'black',
  textAlign: 'center',
  marginBottom: 10,
  fontWeight: 'bold',
},
clearFiltersButton: {
  backgroundColor: 'black',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
},
clearFiltersButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
});

export default Home;