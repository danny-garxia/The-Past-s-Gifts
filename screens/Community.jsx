import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, get } from 'firebase/database';
import { FIREBASE_AUTH,FIREBASE_DB,FIREBASE_STG } from '../fireBaseConfig';
import { ref as storageRef, getDownloadURL } from 'firebase/storage'; 
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Community = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [imageURL, setImageURL] = useState({});
  
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;
    useEffect(() => {
      fetchUserData();
    }, []);
  
      const fetchUserData = async () => {
        try {
          const usersList = await getUsersList();
          setUsers(usersList);
          await fetchAndSetImageURLs(usersList);
            } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      const getUsersList = async () => {
        const usersRef = ref(db, 'posts');
        const usersSnapshot = await get(usersRef);
        const usersList = [];
        usersSnapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          usersList.push(userData);
        });
        return usersList;
      };
      const fetchAndSetImageURLs = async (usersList) => {
        const imageUrls = {}; // Object to store image URLs   
         await Promise.all(usersList.map(async (user) => {
        const imageURL = await fetchUploadedImage(user.userId);
         imageUrls[`${user.userId}`] = imageURL; // Store the imageURL directly in the imageUrls object
         }));
        usersList.forEach(user => {
          setImageURL(imageUrls);
        });
      };

  const fetchUploadedImage = async (userId) => {
    try {
      const imagePath = `profile_pics/${userId}_profile_image`;
      const jpgImageRef = storageRef(stg, `${imagePath}.jpg`);
      const pngImageRef = storageRef(stg, `${imagePath}.png`);
  
      const [jpgDownloadURL, pngDownloadURL] = await Promise.all([
        getDownloadURL(jpgImageRef).catch(error => null),
        getDownloadURL(pngImageRef).catch(error => null)
      ]);

      return jpgDownloadURL || pngDownloadURL; // Return the first available URL
    } catch (error) {
      console.error('Error fetching post image:', error);
      return null;
    }
  };
  
  const renderUserImage = (user) => {
      const imageUrl = imageURL[`${user.userId}`];
      if (imageUrl) {
        return (
          <>
            <Image source={{ uri: imageUrl }} style={styles.profilePicture} />
          </>
        );
      } else {
        return <Text>No image found</Text>;
      }
    
  };

  const renderChatIcon = (userId) => {
    return (
    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { userId })}}>
    <MaterialCommunityIcons name="message-text" size={36} color="black" />
    </TouchableOpacity>
  );
};

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Display images and chat icons for each user */}
        {users.map(user => (
          <View key={user.userId} style={styles.userContainer}>
            <View style={styles.nonSelectableContent}>
              {imageURL[user.userId] ? (
                renderUserImage(user, imageURL[user.userId])
              ) : (
                <Text>No image found</Text>
              )}
              <Text style={styles.username}>{user.username}</Text>
            </View>
            {renderChatIcon(user.userId)}
          </View>
        ))}
      </View>
    </ScrollView>
      );
    };
  
  const styles = StyleSheet.create({
    scrollView: {
    backgroundColor:'white',
      flex: 1,
    },
    container: {
      flex:1,
      alignItems: 'center',
    },
    userContainer: {
        flexDirection: 'row', // Align children horizontally
        alignItems: 'center', // Center the content vertically
        marginVertical: 10, 
        width:'80%',
        borderColor:'rgb(203, 174, 115)',
        borderWidth:3,
        padding:10,
        borderRadius:10
      },

      nonSelectableContent: {
        flex: 1, // Make it take up remaining space
        userSelect: 'none', // Disable selection for children
        flexDirection: 'row', 
        alignItems: 'center', 
      },
      
      userTouchable: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1,
      },
     
    profilePicture: {
      width: 60,
      height: 60,
      borderRadius: 35,
      marginRight: 25,
    },
    
    username: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      margin: 15
    },
    
    iconContainer: {
      position: 'absolute', // Make icon absolute-positioned/static
      right: 10, 
      top: 12, 
    },

  });

export default Community;