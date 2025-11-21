import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskListScreen from "../views/screens/TaskListScreen";
import TaskFormScreen from "../views/screens/TaskFormScreen";
import StatsScreen from "../views/screens/StatsScreen";
import { Task } from "../models/Task";

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task } | undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: "My Tasks" }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={{ title: "Task" }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: "Statistics" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
