import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreator';
import { postComment }  from '../redux/ActionCreator';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, comment, author, date) => 
        dispatch(postComment(dishId, rating, comment, author, date))
})

function RenderDish(props) {
    const dish = props.dish;
    
    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy}) => {
        if (dx < -200) // indicates a right to left gesture of more than 200
            return true;
        else   
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => { // define what happens when the gesture starts
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => { // what happens when gesture ends
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites?', // alert title and body
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [ // specify each button as an object
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    { cancelable: false }
                )

            return true;
        }
    });

    if (dish != null) {
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}
            >
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.formRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => {
                                return props.favorite ? console.log('Already favorite') : props.onPress()
                            }}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={props.onCommentPress}
                        />
                    </View>

                </Card>
            </Animatable.View>
        )
    } else return <View></View>
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return(
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <View style={styles.commentRating}>
                    <Rating 
                        startingValue={parseInt(item.rating)} 
                        imageSize={15}
                        style={styles.commentRating}
                        readonly
                    />
                </View>
                
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    }

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

class DishDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            author: '',
            comment: '',
            rating: 3,
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    resetForm = () => {
        this.setState({
            author: '',
            comment: '',
        });
    }

    handleRating = (rating) => {
        this.setState({ rating: rating })
    }

    handleComment = (dishId) => () => {
        
        const date = new Date().toISOString();

        this.props.postComment(
            dishId, 
            this.state.rating,
            this.state.comment,
            this.state.author,
            date
        );
        this.toggleModal();
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        const comments = this.props.comments.comments.filter((comment) => comment.dishId === dishId)
        
        return (
            <ScrollView>
                <RenderDish 
                    // use dishId as the index. + converts to number
                    dish={this.props.dishes.dishes[+dishId]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onCommentPress={this.toggleModal}
                />

            <Modal
                style={styles.modal}
                animationType={'slide'}
                transparent={false}
                visible={this.state.showModal}
                onDismiss={() => { this.toggleModal(); this.resetForm() }}
                onRequestClose={() => { this.toggleModal(); this.resetForm() }}
            >
                <View style={styles.formRow}>
                    <Rating
                        type='star'
                        ratingCount={5}
                        count={5}
                        imageSize={60}
                        showRating
                        onFinishRating={this.handleRating}
                    />
                </View>
                <View style={styles.formRow}>
                    <Input 
                        placeholder='Author'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        leftIconContainerStyle={styles.formIcon}
                        onChangeText={(val) => this.setState({ author: val })}
                    />
                </View>
                <View style={styles.formRow}>
                    <Input
                        placeholder='Comment'
                        leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                        leftIconContainerStyle={styles.formIcon}
                        onChangeText={(val) => this.setState({ comment: val })}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        title='SUBMIT'
                        onPress={this.handleComment(dishId)}
                        containerStyle={styles.formButton}
                        buttonStyle={{ backgroundColor: '#512DA8' }}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        title='CANCEL'
                        onPress={this.toggleModal}
                        containerStyle={styles.formButton}
                        buttonStyle={{ backgroundColor: '#808080' }}
                    />
                </View>
            </Modal>

                <RenderComments comments={comments} />
            </ScrollView>
        )
    }
    
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    formIcon: {
        marginRight: 15
    },
    formButton: {
        flex: 1,
    },
    commentRating: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
