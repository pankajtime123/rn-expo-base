

import AppPressable from '@/src/components/ui/AppPressable/AppPressable'
import AppRow from '@/src/components/ui/AppRow/AppRow'
import AppText from '@/src/components/ui/AppText/AppText'
import AppView from '@/src/components/ui/AppView/AppView'
import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet, TextInput } from 'react-native'

let uniqueId = 0

const RoughScreen = () => {
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

export default RoughScreen

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



// import AppText from '@/src/components/ui/AppText/AppText'
// import AppView from '@/src/components/ui/AppView/AppView'
// import React, { useCallback, useState } from 'react'
// import { Button, FlatList, TextInput } from 'react-native'

// const RoughScreen = () => {
//   const [tasks, setTasks] = useState([
//     {
//       id: '1',
//       title: 'Sample Task',
//       tasks: []
//     },
//     {
//       id: '2',
//       title: 'Parent Task',
//       tasks: [
//         { id: '3', title: 'Subtask A', tasks: [] },
//         { id: '4', title: 'Subtask B', tasks: [] }
//       ]
//     }
//   ])

//   // Recursive function to add subtask anywhere in tree
//   const addSubtask = (parentId: string, title: string) => {
//     const addTaskRecursively = (items: any[]): any[] =>
//       items.map((item) => {
//         if (item.id === parentId) {
//           const newSubtask = {
//             id: Date.now().toString(), // unique ID
//             title,
//             tasks: []
//           }
//           return { ...item, tasks: [...item.tasks, newSubtask] }
//         } else if (item.tasks?.length) {
//           return { ...item, tasks: addTaskRecursively(item.tasks) }
//         }
//         return item
//       })

//     setTasks((prev) => addTaskRecursively(prev))
//   }

//   return (
//     <AppView mt={100} style={{ flex: 1, padding: 16 }}>
//       <ListWrapper data={tasks} level={0} onAddTask={addSubtask} />
//     </AppView>
//   )
// }

// export default RoughScreen

// const ListWrapper = ({ data, level = 0, onAddTask }) => {
//   const renderItem = useCallback(
//     ({ item }) => {
//       return (
//         <AppView style={{ marginLeft: level * 16, marginVertical: 6 }}>
//           {/* Task title */}
//           <AppText style={{ fontWeight: level === 0 ? '700' : '500' }}>
//             {item.title} ({item.id})
//           </AppText>

//           {/* Add Subtask Input */}
//           <AddTaskInput parentId={item.id} onAddTask={onAddTask} />

//           {/* Render subtasks recursively */}
//           {item.tasks && item.tasks.length > 0 && (
//             <ListWrapper data={item.tasks} level={level + 1} onAddTask={onAddTask} />
//           )}
//         </AppView>
//       )
//     },
//     []
//   )

//   return (
//     <FlatList
//       data={data}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//     />
//   )
// }

// const AddTaskInput = ({ parentId, onAddTask }) => {
//   const [text, setText] = useState('')

//   const handleAdd = () => {
//     if (text.trim().length > 0) {
//       onAddTask(parentId, text.trim())
//       setText('')
//     }
//   }

//   return (
//     <AppView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//       <TextInput
//         value={text}
//         onChangeText={setText}
//         placeholder="Add subtask..."
//         style={{
//           flex: 1,
//           borderWidth: 1,
//           borderColor: '#ccc',
//           padding: 6,
//           borderRadius: 6,
//           marginRight: 8,
//         }}
//       />
//       <Button title="Add" onPress={handleAdd} />
//     </AppView>
//   )
// }
