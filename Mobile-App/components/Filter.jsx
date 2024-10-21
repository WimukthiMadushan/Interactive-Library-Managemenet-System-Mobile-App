import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from "axios";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Filter = ({
    setFilterClicked,
    booksSet,
    defaultBooks,
    selectedCategories,
    setSelectedCategories,
    selectedRating,
    setSelectedRating,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setFiltersApplied,
    allCategory
  }) => {

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date.toISOString().split('T')[0]);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date.toISOString().split('T')[0]);
    hideEndDatePicker();
  };

  const handleApplyFilter = async () => {
    const filters = {
      category: selectedCategories,
      rating: selectedRating,
      start: startDate,
      end: endDate
    };

    try {
      const response = await axios.post("http://192.168.188.169:5001/api/book/mobilefilter", filters);
      
      const books = response.data.map(book => ({
        ...book,
        Author: `${book.Author_First_Name} ${book.Author_Last_Name}`
      }));
      booksSet(books);
      setFilterClicked(false); // reset the filter modal after applying
      setFiltersApplied(true); // set the filters applied flag
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleReset = () => {
    booksSet(defaultBooks); // Reset to default books
    setSelectedCategories([]); // Reset selected categories
    setSelectedRating(null); // Reset selected rating
    setStartDate(''); // Reset start date
    setEndDate(''); // Reset end date
    setFilterClicked(false); // Close the filter modal
    setFiltersApplied(false);
  };

  return (
    <View style={styles.dropdown}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Category</Text>
        {selectedCategories.length > 0 && (
          <Text style={styles.selectedCountText}>
            {selectedCategories.length} Selected
          </Text>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.categoriesContainer} style={styles.scrollView}>
        {allCategory.map((category) => {
          const isSelected = selectedCategories.includes(category.Cat_ID);
          return (
            <TouchableOpacity
              key={category.Cat_ID}
              style={[
                styles.categoryButton,
                isSelected && styles.selectedCategoryButton,
              ]}
              onPress={() => toggleCategorySelection(category.Cat_ID)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  isSelected && styles.selectedCategoryButtonText,
                ]}
              >
                {category.Cat_Name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Published Date Section */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.middleSectionTitle}>Published Date</Text>
      </View>
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={showStartDatePicker} style={styles.dateInput}>
          <Text>{startDate || "Start Date"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showEndDatePicker} style={styles.dateInput}>
          <Text>{endDate || "End Date"}</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />

      {/* Rating Section */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.middleSectionTitle}>Rating</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[5, 4, 3, 2, 1].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              selectedRating === rating && styles.selectedRatingButton,
            ]}
            onPress={() => setSelectedRating(rating)}
          >
            {rating !== 5 && (
              <MaterialCommunityIcons name="greater-than-or-equal" size={14} color={selectedRating === rating ? "black" : "gray"} />
            )}
            <Text
              style={[
                styles.ratingButtonText,
                selectedRating === rating && styles.selectedRatingButtonText,
              ]}
            >
              {rating}
            </Text>
            <AntDesign name="star" size={14} color="gold" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilter}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 170, // Adjust this value based on your layout
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    zIndex: 1,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  middleSectionTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  selectedCountText: {
    fontSize: 13,
    fontWeight: "normal",
    marginLeft: 25,
  },
  scrollView: {
    maxHeight: 150, // Adjust this value based on the height of 3 categories
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  selectedCategoryButton: {
    backgroundColor: "lightgray",
  },
  categoryButtonText: {
    color: "gray",
  },
  selectedCategoryButtonText: {
    color: "black",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ratingButton: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    width: 55,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  selectedRatingButton: {
    backgroundColor: "lightgray",
  },
  ratingButtonText: {
    color: "gray",
  },
  selectedRatingButtonText: {
    color: "black",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  resetButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#d9d9d9",
    borderColor: "gray",
    alignItems: "center",
    marginRight: 10,
  },
  resetButtonText: {
    color: "black",
  },
  applyButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "black",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
  },
});

export default Filter;