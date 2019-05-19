import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { MailComposer } from 'expo';

const styles = StyleSheet.create({
    text: {
        lineHeight: 35
    }
})

class Contact extends Component {
    
    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        });
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                    <Card title='Contact Information'>
                        <Text style={styles.text}>121, Clear Water Bay Road</Text>
                        <Text style={styles.text}>Clear Water Bay, Kowloon</Text>
                        <Text style={styles.text}>HONG KONG</Text>
                        <Text style={styles.text}>Tel: +852 1234 5678</Text>
                        <Text style={styles.text}>Fax: +852 8765 4321</Text>
                        <Text style={styles.text}>Email:confusion@food.net</Text>
                        <Button
                            title='Send Email'
                            buttonStyle={{ backgroundColor: '#512DA8' }}
                            icon={<Icon 
                                    name='envelope-o' 
                                    type='font-awesome'
                                    color='#fff'
                                    containerStyle={{ marginRight: 15 }}
                                    />}
                            onPress={this.sendMail}
                        />
                    </Card>
                </Animatable.View>
            </ScrollView>
        )
    }
}

export default Contact;