
// SignUp.js

import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STG} from '../fireBaseConfig';
import Logo from '../imgs/TIMELOGO.png';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { ref, set,get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


const Post = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [years, setYears] = useState('');
    const [days, setDays] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const [notifYears, setNotifYears] = useState('');
    const [notifDays, setNotifDays] = useState('');
    const [notifMinutes, setNotifMinutes] = useState('');

    const [userName, setUserName] = useState('');
    const [encMessage, setEncMessage] = useState('');
    const [decMessage, setDecMessage] = useState('');
    const navigation = useNavigation(); // Use useNavigation hook

    useEffect(() => {
        fetchUserName();
    }, []);

    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;

    const fetchUserName = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const snapshot = await get(ref(db, `users/${userId}/username`));
                const fetchedUserName = snapshot.val();
                if (fetchedUserName) {
                    setUserName(fetchedUserName); // Set the fetched username in the state
                } else {
                    console.log('Username not found for the user.');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleImageSelection = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1
            });
            if (!result.cancelled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };

    const uploadImageToStorage = async () => {
        try {
            if (!selectedImage) {
                console.error('No image selected');
                return;
            }
    
            // Fetch the current user ID
            const userId = auth.currentUser.uid;
    
            // Fetch the current post numbers array from the database
            const postNumbersSnapshot = await get(ref(db, `posts/${userId}/postNumbers`));
            let postNumbers = postNumbersSnapshot.val() || []; // If no post numbers exist, default to an empty array
    
            // Increment the post number
            const postNumber = postNumbers.length + 1;
            postNumbers.push(postNumber);
    
            // // Write the updated post numbers array back to the database
            await set(ref(db, `posts/${userId}/postNumbers`), postNumbers);
    
            // Use the incremented post number as part of the post name
            const postName = `post_${postNumber}`;
    
            // Continue with image upload as before
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const fileExtension = selectedImage.split('.').pop(); // Extract the file extension
    
            const imageName = `${userId}_${postName}_image.${fileExtension}`;
            const folderPath = 'User_Posts/';
            const imagePath = folderPath + imageName;
            const imageRef = storageRef(stg, imagePath);
    
            // Upload the image
            await uploadBytes(imageRef, blob);
    
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(imageRef);
            const timestamp = Date.now();
    
            // Call writeUserData with all required parameters
            writeUserData(userId, userName, years, days, hours, minutes, postName, timestamp,decMessage, encMessage,notifDays,notifMinutes,notifYears);
    
            // Reset input fields and selected image
            setSelectedImage(null);
            setYears('');
            setDays('');
            setHours('');
            setMinutes('');
            setEncMessage('');
            setDecMessage('');
            setNotifYears('');
            setNotifDays('');
            setNotifMinutes('');
                 
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    

    const writeUserData = (userId, username, years, days, hours, minutes, postName, timestamp, encMessage,decMessage, notifDays,notifMinutes,notifYears) => {
        const userData = {
            username: username,
            years: years,
            days: days,
            hours: hours,
            minutes: minutes,
            postName: postName, // Include postName data in the userData object
            userId: userId,
            timestamp: timestamp,
            encMessage: encMessage,
            decMessage: decMessage,
            notifDays: notifDays,
            notifMinutes: notifMinutes,
            notifYears: notifYears
        };
    
        // Set user data in the Firebase Realtime Database under the "posts" table
        set(ref(db, `posts/${userId}`), userData)
            .then(() => {
                console.log('User data written successfully!');
            })
            .catch((error) => {
                console.error('Error writing user data: ', error);
            });
    };
    
    

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={handleImageSelection} style={selectedImage ? styles.buttonWithImage : styles.button}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
                        ) : (
                            <Text style={styles.buttonText}>Select Image Or Video For Time Capsule</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.button2}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={years}
                            placeholderTextColor={'black'}
                            fontWeight={'bold'}
                            style={styles.input}
                            placeholder="Years"
                            onChangeText={(text) => setYears(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={days}
                            style={styles.input}
                            placeholderTextColor={'black'}
                            fontWeight={'bold'}
                            placeholder="Days"
                            onChangeText={(text) => setDays(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={hours}
                            style={styles.input}
                            placeholder="Hours"
                            placeholderTextColor={'black'}
                            fontWeight={'bold'}
                            onChangeText={(text) => setHours(text)}
                            keyboardType="numeric"
                        />
                        
                        <TextInput
                            value={minutes}
                            style={styles.inputMessage}
                            placeholderTextColor={'black'}
                            placeholder="Minutes"
                            onChangeText={(text) => setMinutes(text)}
                            keyboardType="numeric"
                            fontWeight={'bold'}
                        />
                    </View>
                    <Text style={styles.buttonText}>Encapsulating For {`${minutes}`} Minutes | {`${days}`} Days | {`${hours}`} hours | {`${years}`} Years</Text>
                </View>
                <View style={styles.button3}>
                <TextInput 
                style={styles.inputMessage2}
                     value={encMessage}
                     placeholder="Write Hidden Message"
                     placeholderTextColor={'white'}
                     fontWeight={'bold'}
                     onChangeText={(text)=>setEncMessage(text)}
                       />
                </View>
                <View style={styles.button2}>
                <TextInput 
                style={styles.inputMessage}
                     value={decMessage}
                     placeholder="Write Public Message"
                     placeholderTextColor={'black'}
                     fontWeight={'bold'}
                     onChangeText={(text)=>setDecMessage(text)}
                       />
                </View>
                

                <View style={styles.button3}>
                    <View style={styles.inputContainer}>
                    <TextInput
                            value={notifMinutes}
                            style={styles.inputMessage2}
                            placeholderTextColor={'white'}
                            placeholder="Minutes"
                            onChangeText={(text) => setNotifMinutes(text)}
                            keyboardType="numeric"
                            fontWeight={'bold'}
                        />
                        <TextInput
                            value={notifDays}
                            placeholderTextColor={'white'}
                            fontWeight={'bold'}
                            style={styles.inputMessage2}
                            placeholder="Days"
                            onChangeText={(text) => setNotifDays(text)}
                            keyboardType="numeric"
                        />

                        <TextInput
                            value={notifYears}
                            style={styles.inputMessage2}
                            placeholder="Hours"
                            placeholderTextColor={'white'}
                            fontWeight={'bold'}
                            onChangeText={(text) => setNotifYears(text)}
                            keyboardType="numeric"
                        />
                        
                   
                    </View>
                    <Text style={styles.buttonText2}>Notify Me {`${notifMinutes}`} Minutes | {`${notifDays}`} Days | {`${notifYears}`} Years  Before Capsule Opens</Text>
                </View>


                <View style={styles.button}>
                    <TouchableOpacity onPress={uploadImageToStorage}>
                        <Text style={styles.buttonText}>Send Capsule To Community </Text>
                    </TouchableOpacity>
                </View>
                </View>

        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Center the content vertically
        marginTop: '50%'
    },
    button: {
        width: '80%',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderColor: 'black', 
        borderWidth:3,
        borderRadius:9,
        backgroundColor: 'rgba(203, 174, 115, .7)',
    },
    button2: {
        marginTop: 10,
        width: '80%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 9,
        borderColor: '#cbae73', 
        borderWidth: 4,
    },
    button3: {
        marginTop: 10,
        width: '80%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 9,
        borderColor: '#cbae73', 
        borderWidth: 4,
        backgroundColor:'black'
    },
    imageContainer: {
        alignItems: 'center', // Center the content horizontally
        width: '100%',
        marginTop: '50%',
    },
    buttonWithImage: {
        backgroundColor: 'transparent', // No background color
        marginTop:-90,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black'
    },
    buttonText2:{
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    inputContainer: {
        flexDirection: 'row', // Change from 'column' to 'row'
        marginBottom: 20,
        marginLeft: 10,
        
    },
    input: {
        textAlign:'center',
        paddingHorizontal: 9,
        marginRight: 10,
        borderRightColor:'rgb(203, 174, 115)',
        borderRightWidth:1
    },
    
    inputMessage: {
        marginRight: 10,
        
    },
    inputMessage2: {
        marginRight: 10,
        color:'white'
        
    },
    
    
});
export default Post;
