import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const BookDetails = () => {
  const { book } = useLocalSearchParams();
  const bookDetails = JSON.parse(book);
  const navigation = useNavigation();

  const [bookCopy, setBookCopy] = useState([]);
  const [expandedLanguages, setExpandedLanguages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCopyId, setSelectedCopyId] = useState(null);
  const [reservationStartTime, setReservationStartTime] = useState('');
  const [reservationEndTime, setReservationEndTime] = useState('');
  const [isStartDateTimePickerVisible, setStartDateTimePickerVisibility] = useState(false);
  const [isEndDateTimePickerVisible, setEndDateTimePickerVisibility] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedBookDetails = {
    ...bookDetails,
    Published_Date: formatDate(bookDetails.Published_Date),
  };

  useEffect(() => {
    const fetchBookCopies = async () => {
        try {
            const response = await axios.get(`http://192.168.188.169:5001/api/bookcopy/${formattedBookDetails.Book_ID}`);
            setBookCopy(response.data);
            

            // Set the first language to be expanded by default
            if (response.data.length > 0) {
              const firstLanguage = response.data[0].Language;
              setExpandedLanguages({ [firstLanguage]: true });
            }
        } catch (error) {
            console.error("Error fetching book copies:", error);
        }
    };

    const fetchReview = async () => {
        try {
          const response = await axios.get(`http://192.168.188.169:5001/api/review/${formattedBookDetails.Book_ID}`);
          setReviews(response.data);
        } catch (error) {
          console.log("Error fetching data:", error.message);
        }
    };

    fetchBookCopies();
    fetchReview();
  }, []);

  const handleReserve = (copyId) => {
    setSelectedCopyId(copyId);
    setModalVisible(true);
  };

  const handleConfirmReservation = async () => {
    try {
      const startDate = new Date(reservationStartTime);
      const endDate = new Date(reservationEndTime);
      
      startDate.setHours(startDate.getHours() + 5);
      startDate.setMinutes(startDate.getMinutes() + 30);
      endDate.setHours(endDate.getHours() + 5);
      endDate.setMinutes(endDate.getMinutes() + 30);
  
      const reserveDate = startDate.toISOString().split("T")[0];
      const reserveStartTime = startDate.toISOString().split("T")[1].slice(0, 5);
      const reserveEndTime = endDate.toISOString().split("T")[1].slice(0, 5);
  
      const userId = parseInt(await AsyncStorage.getItem("userId"), 10);
  
      const response = await axios.post(
        `http://192.168.188.169:5001/api/reserve`,
        {
          UserID: userId,
          Copy_ID: selectedCopyId,
          isComplete: 0,
          Reserve_Date: reserveDate,
          Reserve_Time: reserveStartTime,
          Reserve_End_Time: reserveEndTime,
        },
      );
  
      setBookCopy((prevCopies) =>
        prevCopies.map((copy) =>
          copy.Copy_ID === selectedCopyId ? { ...copy, isReserved: true } : copy
        )
      );
      setModalVisible(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("You have already reserverd your maximum number of reservations");
        setErrorModalVisible(true);
      } else {
        console.log(error.message);
        alert("Error reserving book. Please try again later.");
      }
    }
  };

  const toggleLanguage = (language) => {
    setExpandedLanguages(prevState => ({
      ...prevState,
      [language]: !prevState[language]
    }));
  };

  const groupedBookCopies = bookCopy.reduce((acc, copy) => {
    if (!acc[copy.Language]) {
      acc[copy.Language] = [];
    }
    acc[copy.Language].push(copy);
    return acc;
  }, {});

  const showStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(true);
  };
  
  const hideStartDateTimePicker = () => {
    setStartDateTimePickerVisibility(false);
  };
  
  const handleStartDateTimeConfirm = (date) => {
    setReservationStartTime(date.toISOString());
    hideStartDateTimePicker();
  };
  
  const showEndDateTimePicker = () => {
    setEndDateTimePickerVisibility(true);
  };
  
  const hideEndDateTimePicker = () => {
    setEndDateTimePickerVisibility(false);
  };
  
  const handleEndDateTimeConfirm = (date) => {
    setReservationEndTime(date.toISOString());
    hideEndDateTimePicker();
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={30} color="white" />
      </TouchableOpacity>
      <ImageBackground source={{ uri: formattedBookDetails.Image_Path }} style={styles.bookImageBackground}>
        <View style={styles.overlay} />
      </ImageBackground>

      {/* Book Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.imageAndTextContainer}>
          <Image source={{ uri: formattedBookDetails.Image_Path }} style={styles.bookImage} />
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{formattedBookDetails.Title.trim()}</Text>
            <Text style={styles.bookAuthor}>By {formattedBookDetails.Author.trim()}</Text>
          </View>
        </View>
        <View style={styles.additionalDetailsContainer}>
          <Text style={styles.bookDescription}>{formattedBookDetails.Description.trim()}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Published Date: <Text style={styles.value}>{formattedBookDetails.Published_Date}</Text></Text>
            <Text style={styles.label}>Category: <Text style={styles.value}>{formattedBookDetails.Category}</Text></Text>
            <Text style={styles.label}>ISBN: <Text style={styles.value}>{formattedBookDetails.ISBN_Number}</Text></Text>
          </View>
        </View>

        {/* Available Copies Section */}
        <View style={styles.availableCopiesContainer}>
          <Text style={styles.sectionTitle}>Available Copies</Text>
          {Object.keys(groupedBookCopies).map(language => (
            <View key={language}>
              <TouchableOpacity style={styles.languageButton} onPress={() => toggleLanguage(language)}>
                <Text style={styles.languageTitle}>{language}</Text>
                <FontAwesome name={expandedLanguages[language] ? "angle-up" : "angle-down"} size={16} color="black" />
              </TouchableOpacity>
              <View style={styles.divider} />
              {expandedLanguages[language] && (
                <View style={styles.copyCardsContainer}>
                  {groupedBookCopies[language].map((copy) => (
                    <View key={copy.Copy_ID} style={styles.copyCard}>
                      <Text style={[styles.copyText, styles.copyLabel]}>Location: <Text style={styles.copyValue}>Floor {copy.Floor}, Section {copy.Section}, Shelf {copy.Shelf_Number}, Row {copy.RowNum}</Text></Text>
                      <Text style={[styles.copyText, styles.copyLabel]}>Status: <Text style={[styles.copyValue, copy.isReserved ? styles.reserved : copy.isBorrowed ? styles.borrowed : styles.available]}>{copy.isReserved ? 'Reserved' : copy.isBorrowed ? 'Borrowed' : 'Available'}</Text></Text>
                      <TouchableOpacity
                        style={[styles.reserveButton, (Boolean(copy.isReserved) || Boolean(copy.isBorrowed)) && styles.disabledButton]}
                        onPress={() => handleReserve(copy.Copy_ID)}
                        disabled={Boolean(copy.isReserved) || Boolean(copy.isBorrowed)}
                      >
                        <Text style={styles.reserveButtonText}>Reserve</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Reservation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Reservation Start and End Time</Text>
            <TouchableOpacity onPress={showStartDateTimePicker} style={styles.dateInput}>
                <Text>{reservationStartTime ? new Date(reservationStartTime).toLocaleString() : "Reservation Start Time"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={showEndDateTimePicker} style={styles.dateInput}>
                <Text>{reservationEndTime ? new Date(reservationEndTime).toLocaleString() : "Reservation End Time"}</Text>
            </TouchableOpacity>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReservation}>
                <Text style={styles.buttonText}>Confirm Reservation</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        <DateTimePickerModal
            isVisible={isStartDateTimePickerVisible}
            mode="datetime"
            onConfirm={handleStartDateTimeConfirm}
            onCancel={hideStartDateTimePicker}
        />
        <DateTimePickerModal
            isVisible={isEndDateTimePickerVisible}
            mode="datetime"
            onConfirm={handleEndDateTimeConfirm}
            onCancel={hideEndDateTimePicker}
        />
      </Modal>

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewTitle}>Reviews</Text>
        {reviews.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsCarousel}>
            {reviews.map((review) => (
              <View key={review.Review_ID} style={styles.reviewCard}>
                <Text style={styles.reviewUsername}>{review.Username}</Text>
                <Text style={styles.reviewText}>{review.Review}</Text>
                <View style={styles.reviewRatingContainer}>
                  {Array.from({ length: review.Rating }).map((_, index) => (
                    <AntDesign key={index} name="star" size={16} color="gold" />
                  ))}
                </View>
                <Text style={styles.reviewDate}>Date: {new Date(review.Review_Date).toLocaleDateString()}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noReviewsText}>No reviews available.</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => {
          setErrorModalVisible(!errorModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setErrorModalVisible(false);
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    backButton: {
    position: 'absolute',
    top: 40, // Adjust this value as needed
    left: 20, // Adjust this value as needed
    zIndex: 1,
  },
  bookImageBackground: {
    width: '100%',
    height: 400,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -50, // Adjust this value as needed
    position: 'relative',
  },
  imageAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  bookImage: {
    width: 175,
    height: 255,
    top: -130, // Adjust this value as needed
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20, // Adjust this value to provide space between the image and text
    marginBottom: 150,
    marginTop: -10, // Ensure this value is equal to or greater than the height of the book image
  },
  additionalDetailsContainer: {
    marginTop: -150, // Ensure this value is equal to or greater than the height of the book image
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: 'gray',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  availableCopiesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 5,
    alignItems: 'center',
    paddingVertical: 10,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  copyCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  copyCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '48%', // Adjust this value to fit two cards per row
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyText: {
    fontSize: 14,
    marginBottom: 5,
  },
  copyLabel: {
    fontWeight: 'bold',
  },
  copyValue: {
    fontWeight: 'normal',
  },
  available: {
    color: 'green',
  },
  borrowed: {
    color: 'red',
  },
  reserved: {
    color: 'orange',
  },
  reserveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Center the title
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
reviewsContainer: {
  marginTop: 20,
  marginLeft:10,
  marginRight:20,
},
reviewsCarousel: {
  paddingVertical: 10,
},
reviewCard: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 10,
  marginRight: 10,
  width: 250, // Adjust the width as needed
  alignItems: 'center', // Center items horizontally
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  marginBottom: 10,
  marginLeft: 10,
},
reviewUsername: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
  textAlign: 'center', // Center text
},
reviewText: {
  fontSize: 14,
  marginBottom: 5,
  textAlign: 'center', // Center text
},
reviewRating: {
  fontSize: 14,
  color: 'gray',
  marginBottom: 5,
  textAlign: 'center', // Center text
},
reviewDate: {
  fontSize: 12,
  color: 'gray',
  textAlign: 'center', // Center text
},
reviewRatingContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: 5,
},
noReviewsText: {
  fontSize: 14,
  color: 'gray',
  textAlign: 'center',
  marginTop: 10,
  marginBottom: 30,
},
modalMessage: {
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'center',
},
okButton: {
  backgroundColor: 'black',
  padding: 10,
  width: '25%',
  borderRadius: 10,
  alignItems: 'center',
},
});

export default BookDetails;