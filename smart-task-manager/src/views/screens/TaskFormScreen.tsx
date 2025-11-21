import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Task } from "../../models/Task";
import {
  createTask,
  updateTask,
  deleteTask,
} from "../../controllers/taskController";

type Props = NativeStackScreenProps<RootStackParamList, "TaskForm">;

const TaskFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const existingTask: Task | undefined = route.params?.task;

  const [title, setTitle] = useState(existingTask?.title ?? "");
  const [description, setDescription] = useState(
    existingTask?.description ?? ""
  );
  const [dueDate, setDueDate] = useState(existingTask?.dueDate ?? "");
  const [isImportant, setIsImportant] = useState(
    existingTask?.isImportant ?? false
  );
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existingTask ? "Edit Task" : "New Task",
    });
  }, [navigation, existingTask]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required.");
      return;
    }

    try {
      setSaving(true);

      if (existingTask) {
        await updateTask(existingTask.id, {
          title,
          description,
          dueDate: dueDate || undefined,
          isImportant,
        });
      } else {
        await createTask({
          title,
          description,
          dueDate: dueDate || undefined,
          isImportant,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Failed to save task", error);
      Alert.alert("Error", "Something went wrong while saving your task.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!existingTask) return;

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(existingTask.id);
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete task", error);
            Alert.alert("Error", "Could not delete the task.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Finish portfolio project"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description..."
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Due Date (optional)</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="2025-11-30 or 'Tomorrow evening'"
            style={styles.input}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Important</Text>
          <Switch value={isImportant} onValueChange={setIsImportant} />
        </View>

        <View style={styles.buttonsRow}>
          {existingTask && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={confirmDelete}
              disabled={saving}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f7",
    flexGrow: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#1e88e5",
  },
  deleteButton: {
    backgroundColor: "#e53935",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TaskFormScreen;
