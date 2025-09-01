import { screenWidth } from '@/src/utils/resizing'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'

/*
Typical Interview Question
“Build a typeahead/autocomplete component in React Native. When the user types in a text input, fetch matching suggestions from an API (or a local list), show them in a dropdown, and allow the user to select one.”
They may extend it with:
Add debounce so API isn’t called on every keystroke.
Show a loading indicator while fetching.
Close the dropdown when an item is selected.
Handle empty / no results state.

🧠 Theory to Explain in Interview
Controlled TextInput → store user input in state.
Debouncing → wait a short delay (e.g., 300ms) before calling API to avoid too many calls.
Dropdown UI → FlatList/ScrollView under the TextInput showing suggestions.
Selection handling → clicking suggestion should update TextInput and close the dropdown.

Edge cases:
No results → show “No matches found”.
Loading → show spinner.
Cancel request on unmount or fast typing.
*/

type TListItem = { id: number, title: string }

const list = [{ id: 1, title: 'mango' }, { id: 2, title: 'apple' }]

function debounce(fn: Function, delay: number) {
    let timerId: ReturnType<typeof setTimeout>
    return function (...args: any[]) {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            fn.call(this, ...args)
            clearTimeout(timerId)
        }, delay)

    }
}

const mockApi = async (query: string) => {
    return new Promise<TListItem[]>((resolve) => {
        setTimeout(() => {
            resolve(list.filter((item: TListItem) =>
                item.title.toLowerCase().includes(query.toLowerCase())
            ));
        }, 3000);
    });
};


const Typehead = () => {
    const [suggestionList, setSuggestionList] = useState<TListItem[]>([])
    const [show, setShow] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [empty, setEmpty] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSearch = useCallback(async (text: string) => {
        setLoading(true)
        try {
            let filteredSuggestions = await mockApi(text) //list.filter((item) => (item.title.toLowerCase().includes(text.toLowerCase().trim())))
            if (filteredSuggestions.length > 0 && text) {
                setShow(true)
            } else {
                setShow(false)
            }

            if (!(filteredSuggestions.length > 0)) {
                setEmpty(true)
            } else {
                setEmpty(false)
            }

            setSuggestionList(text === '' ? [] : filteredSuggestions)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const search = debounce(handleSearch, 300)

    const renderItem = useCallback(({ item }: { item: TListItem }) => {
        const handleTextPress = () => {
            setShow(false)
            setSearchInput(item.title)
        }
        return <Text onPress={handleTextPress} >
            {item.title}
        </Text>
    }, [])

    const onChangeText = useCallback((t: string) => {
        search(t)
        setSearchInput(t)
    }, [])

    return (
        <View style={[styles.searchBarWrapper]} >
            <View>
                {loading && <ActivityIndicator style={[styles.loader]} color={'#000'} size={20} />}
                <TextInput value={searchInput} onChangeText={onChangeText} style={[styles.textInput]} placeholder='search here ...' />
            </View>
            {(show || empty) && <FlatList
                data={suggestionList}
                ListEmptyComponent={<Text> No Result Found! </Text>}
                contentContainerStyle={[styles.suggestionsContainer]}
                renderItem={renderItem}
            />}


        </View>
    )
}

export default Typehead

const styles = StyleSheet.create({

    textInput: {
        alignSelf: 'center',
        width: screenWidth - 32,
        borderWidth: 1,
        borderColor: '#000',
        padding: 20
    },
    searchBarWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    suggestionsContainer: {
        backgroundColor: '#ffffffee',
        width: screenWidth - 32,
        gap: 12,
        padding: 16,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#000',

    }, 
    loader:{
        position: 'absolute', 
        right: 10, 
        top: 10
    }

})