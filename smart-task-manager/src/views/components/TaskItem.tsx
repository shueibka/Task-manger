import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Task } from "../../models/Task";

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onToggleStatus,
}) => {
  const isDone = task.status === "done";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Pressable
          onPress={onToggleStatus}
          style={[styles.checkbox, isDone && styles.checkboxDone]}
        />
        <View>
          <Text
            style={[styles.title, isDone && styles.titleDone]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}
        </View>
      </View>
      {task.isImportant && <Text style={styles.important}>!</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#888",
    marginRight: 8,
  },
  checkboxDone: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  important: {
    fontSize: 18,
    color: "#e53935",
    fontWeight: "bold",
  },
});

export default TaskItem;
