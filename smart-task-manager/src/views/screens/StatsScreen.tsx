// src/views/screens/StatsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Task } from "../../models/Task";
import { initTasks, getTasks } from "../../controllers/taskController";

const StatsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      await initTasks();
      setTasks(getTasks());
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status !== "done").length;
  const important = tasks.filter((t) => t.isImportant).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedToday = tasks.filter((t) => {
    if (!t.updatedAt) return false;
    const d = new Date(t.updatedAt);
    d.setHours(0, 0, 0, 0);
    return t.status === "done" && d.getTime() === today.getTime();
  }).length;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total tasks</Text>
          <Text style={styles.cardValue}>{total}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Completed</Text>
          <Text style={styles.cardValue}>{done}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pending</Text>
          <Text style={styles.cardValue}>{pending}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Important</Text>
          <Text style={styles.cardValue}>{important}</Text>
        </View>
      </View>

      <View style={styles.cardWide}>
        <Text style={styles.cardLabel}>Completed today</Text>
        <Text style={styles.cardBigValue}>{completedToday}</Text>
      </View>

      <View style={styles.cardWide}>
        <Text style={styles.cardLabel}>Completion rate</Text>
        <Text style={styles.cardBigValue}>{completionRate}%</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f7",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },
  cardWide: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  cardBigValue: {
    fontSize: 26,
    fontWeight: "700",
  },
});

export default StatsScreen;
