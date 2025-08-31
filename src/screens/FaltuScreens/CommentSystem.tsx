

import AppPressable from '@/src/components/ui/AppPressable/AppPressable'
import AppRow from '@/src/components/ui/AppRow/AppRow'
import AppText from '@/src/components/ui/AppText/AppText'
import AppView from '@/src/components/ui/AppView/AppView'
import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet, TextInput } from 'react-native'

let uniqueId = 0

const CommentSystem = () => {
  const [tasks, setTasks] = React.useState([{ id: uniqueId, tasks: [], title: '' }])

  const addTask = (parentId, title) => {
    function findParentAndTask(items) {
      return items.map((item) => {
        {
          if (item.id === parentId) {
            const newTak = {
              id: ++uniqueId ,
              title,
              tasks: []
            }
            return { ...item, tasks: [...item.tasks, newTak] }
          }
          else if (item.tasks?.length) {
            return {...item, tasks: findParentAndTask(item.tasks)}
          }
        }
        return item
      })

    }

    setTasks(prev => findParentAndTask(prev))
  }

  return (
    <AppView style={[styles.container]}>
      <TakList data={tasks} level={0} addTask={addTask} />
    </AppView>
  )
}

export default CommentSystem

const TakList = ({ data, level = 0, addTask }) => {

  const renderItem = useCallback(({ item }) => {
    return <AppView style={{ marginLeft: level * 16, marginVertical: 6 }}>
      <AppText>
        {item.title}-({item.id})
      </AppText>
      <InputTask parentId={item.id} addTask={addTask} />
      {item.tasks && item?.tasks?.length > 0 && <TakList data={item.tasks} level={level + 1} addTask={addTask} />}
    </AppView>
  }, [])

  return <FlatList
    data={data}
    renderItem={renderItem}
    keyExtractor={item => item.id}
  />
}

const InputTask = ({ parentId, addTask }) => {
  const [text, setText] = useState('')

  const handleAddTask = () => {
    if(text.trim().length === 0) return
    addTask(parentId, text.trim())
    setText('')
  }



  return <AppRow>
    <TextInput value={text} style={styles.input} placeholder='create task' onChangeText={setText} />
    <AppPressable onPress={handleAddTask}  >
      <AppText >Add</AppText>
    </AppPressable>
  </AppRow>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100, 
    padding: 16
    
  }, 
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 4,
      borderRadius: 6,
      marginRight: 8,
    }
})


