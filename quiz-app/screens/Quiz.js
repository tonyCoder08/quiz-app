import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
} from "react-native";
import React from "react";
import Button from "../components/Button";
import { useState, useEffect } from "react";

// function to shuffle the array of answers
const shuffleArr = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
};

const Quiz = ({ navigation, route }) => {
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [questionNumber, setQuestionsNumber] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [score, setScore] = useState(0);
    const { category, difficulty, type } = route.params;

    const makeURL = (category_, difficulty_, type_) => {
        _category = "";
        _difficulty = "";
        _type = "";
        if (category_ != "any") _category = `&category=${category}`;
        if (difficulty_ != "any") _difficulty = `&difficulty=${difficulty}`;
        if (type_ != "any") _type = `&type=${type}`;
        let url = `https://opentdb.com/api.php?amount=10${_category}${_difficulty}${_type}&encode=url3986`;
        return url;
    };
    const getQuiz = async () => {
        // const url = "https://opentdb.com/api.php?amount=10&type=multiple";
        // const url =
        //     "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&encode=url3986";
        const url = makeURL(category, difficulty, type);
        const res = await fetch(url);
        const response = await res.json();
        setQuestions(response.results);
        generateAndShuffleAnswers(response.results[0]);
    };

    const handleNextPress = () => {
        goToNext();
    };
    const goToNext = () => {
        setQuestionsNumber(questionNumber + 1);
        generateAndShuffleAnswers(questions[questionNumber + 1]);
    };

    // handle select
    const handleSelection = (_option) => {
        let result = _option === questions[questionNumber]?.correct_answer;
        if (result) {
            setScore(score + 1);
        }
        if (questionNumber !== 9) goToNext();
    };

    const showResults = () => {
        navigation.navigate("Result", {
            score: score,
        });
    };

    const generateAndShuffleAnswers = (_answers) => {
        if (_answers) {
            let _options = [..._answers?.incorrect_answers];
            let correct_answer = _answers?.correct_answer;
            _options.push(correct_answer);
            shuffleArr(_options);
            setOptions(_options);
        }
    };

    useEffect(() => {
        getQuiz();
    }, []);

    useEffect(() => {
        if (questionNumber == 9) {
            setIsLastQuestion(true);
        }
    }, [questionNumber]);

    return (
        <View style={styles.container}>
            {questions && (
                <>
                    <View style={styles.top}>
                        <Text style={styles.question}>
                            Q.{questionNumber + 1}{" "}
                            {decodeURIComponent(
                                questions[questionNumber]?.question
                            )}
                        </Text>
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSelection(options[0])}
                        >
                            <Text style={styles.option}>
                                {decodeURIComponent(options[0])}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSelection(options[1])}
                        >
                            <Text style={styles.option}>
                                {decodeURIComponent(options[1])}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSelection(options[2])}
                        >
                            <Text style={styles.option}>
                                {decodeURIComponent(options[2])}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSelection(options[3])}
                        >
                            <Text style={styles.option}>
                                {decodeURIComponent(options[3])}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottom}>
                        {isLastQuestion ? (
                            <TouchableOpacity
                                style={[
                                    styles.notionlayout.blue,
                                    styles.notionlayout,
                                    styles.shadowProp,
                                ]}
                                onPress={() => showResults()}
                            >
                                <Text style={styles.notionbutton}>
                                    Show Result
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handleNextPress()}
                                style={[styles.notionlayout, styles.shadowProp]}
                            >
                                <Text style={styles.notionbutton}>SKIP</Text>
                            </TouchableOpacity>
                        )}

                        {/* hide next button and show end button when question number is the last */}
                    </View>
                </>
            )}
        </View>
    );
};

export default Quiz;

const styles = StyleSheet.create({
    container: {
        paddingTop: 31,
        paddingHorizontal: 16,
        height: "100%",
        paddingBottom: 10,
    },
    top: {
        marginVertical: 16,
    },
    options: {
        marginVertical: 16,
        flex: 1,
    },
    bottom: {
        // marginBottom: 12,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    question: {
        fontSize: 28,
    },
    option: {
        fontSize: 20,
        color: "#fff",
        fontFamily: "Inter_400Regular",
    },
    optionButton: {
        paddingVertical: 12,
        backgroundColor: "#473BF0",
        marginVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        fontFamily: "Inter_400Regular",
    },
    notionlayout: {
        blue: {
            backgroundColor: "#264653",
            borderRadius: 9,
            alignItems: "center",
            justifyContent: "center",
        },
        backgroundColor: "#000",
        borderRadius: 15,
        // width: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    notionbutton: {
        color: "white",
        fontSize: 18,
        fontWeight: "semibold",
        paddingVertical: 13,
        paddingHorizontal: 16,
        fontFamily: "",
        fontFamily: "Inter_400Regular",
    },
    shadowProp: {
        shadowColor: "#000000",
        shadowOffset: {
            width: -1,
            height: 0.5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,

        elevation: 5,
    },
});
