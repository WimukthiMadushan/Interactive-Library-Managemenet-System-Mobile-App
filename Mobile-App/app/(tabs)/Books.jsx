import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const Books = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [authState, setAuthState] = useState({ userId: null });
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decoded = jwtDecode(token);
          setAuthState({ userId: decoded.ID });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const borrowedResponse = await axios.get(
          `http://192.168.188.169:5001/api/borrow/${authState.userId}`
        );
        const reservedResponse = await axios.get(
          `http://192.168.188.169:5001/api/reserve/${authState.userId}`
        );

        setBorrowedBooks(borrowedResponse.data);
        setReservedBooks(reservedResponse.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [authState.userId]);

  const handleCancelReservation = (reservationId) => {
    setSelectedReservation(reservationId);
    setModalVisible(true);
  };

  const confirmCancelReservation = async () => {
    try {
      // API call to cancel the reservation
      await axios.delete(
        `http://192.168.188.169:5001/api/reserve/${selectedReservation}`
      );
      setReservedBooks(
        reservedBooks.filter((item) => item.Reserve_ID !== selectedReservation)
      );
      Alert.alert("Success", "Reservation canceled successfully.");
    } catch (error) {
      console.error("Error canceling reservation:", error);
      Alert.alert("Error", "Failed to cancel the reservation.");
    } finally {
      setModalVisible(false);
      setSelectedReservation(null);
    }
  };

  const renderBorrowedBookItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.Title}</Text>
      <Text style={styles.cardText}>ID: {item.Borrow_ID}</Text>
      <Text style={styles.cardText}>Language: {item.Language_Name}</Text>
      <Text style={styles.cardText}>
        Borrow Date: {new Date(item.Borrow_Date).toLocaleDateString()}
      </Text>
      <Text style={styles.cardText}>Borrow Time: {item.Borrow_Time}</Text>
      <Text style={styles.cardText}>
        Location: Floor {item.Floor}, Section {item.Section}, Shelf{" "}
        {item.Shelf_Number}, Row {item.RowNum}
      </Text>
      <Text style={styles.cardText}>
        Return Date: {new Date(item.Return_Date).toLocaleDateString()}
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Review</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReservedBookItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.Title}</Text>
      <Text style={styles.cardText}>ID: {item.Reserve_ID}</Text>
      <Text style={styles.cardText}>Language: {item.Language}</Text>
      <Text style={styles.cardText}>
        Reserve Date: {new Date(item.Reserve_Date).toLocaleDateString()}
      </Text>
      <Text style={styles.cardText}>Reserve Time: {item.Reserve_Time}</Text>
      <Text style={styles.cardText}>End Time: {item.Reserve_End_Time}</Text>
      <Text style={styles.cardText}>
        Location: Floor {item.Floor}, Section {item.Section}, Shelf{" "}
        {item.Shelf_Number}, Row {item.RowNum}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCancelReservation(item.Reserve_ID)}
      >
        <Text style={styles.buttonText}>Cancel Reservation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Borrowed Books</Text>
      <FlatList
        data={borrowedBooks}
        renderItem={renderBorrowedBookItem}
        keyExtractor={(item) => item.Borrow_ID.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No borrowed books available.</Text>
        }
      />

      <Text style={styles.header}>Reserved Books</Text>
      <FlatList
        data={reservedBooks}
        renderItem={renderReservedBookItem}
        keyExtractor={(item) => item.Reserve_ID.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reserved books available.</Text>
        }
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Cancellation</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel this reservation?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={confirmCancelReservation}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f7",
    marginTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default Books;
