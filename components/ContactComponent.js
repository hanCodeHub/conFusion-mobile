import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

const styles = StyleSheet.create({
    text: {
        lineHeight: 35
    }
})

class Contact extends Component {
    
    render () {
    return(
        <ScrollView>
            <Card title='Contact Information'>
                <Text style={styles.text}>121, Clear Water Bay Road</Text>
                <Text style={styles.text}>Clear Water Bay, Kowloon</Text>    
                <Text style={styles.text}>HONG KONG</Text>
                <Text style={styles.text}>Tel: +852 1234 5678</Text>
                <Text style={styles.text}>Fax: +852 8765 4321</Text>
                <Text style={styles.text}>Email:confusion@food.net</Text>
            </Card>
        </ScrollView>
    )
    }

}

export default Contact;