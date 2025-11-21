import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { seedDemoTasks } from "../../scripts/seedTasks";
import { Task } from "../../models/Task";
import TaskItem from "../components/TaskItem";
import {
  initTasks,
  getTasks,
  setTaskStatus,
} from "../../controllers/taskController";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "TaskList">;

type Filter = "all" | "pending" | "done" | "important";
type SortMode = "created_desc" | "created_asc" | "due_asc" | "important";

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("created_desc");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Stats")}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons name="stats-chart-outline" size={22} color="#1e88e5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      await seedDemoTasks();
      await initTasks();
      setAllTasks(getTasks());
      setLoading(false);
    };
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await setTaskStatus(task.id, newStatus);
    setAllTasks([...getTasks()]);
  };

  const filteredAndSorted = useMemo(() => {
    let tasks = [...allTasks];

    // filter
    if (filter === "pending") {
      tasks = tasks.filter((t) => t.status !== "done");
    } else if (filter === "done") {
      tasks = tasks.filter((t) => t.status === "done");
    } else if (filter === "important") {
      tasks = tasks.filter((t) => t.isImportant);
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }

    // sort
    tasks.sort((a, b) => {
      if (sortMode === "created_desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortMode === "created_asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortMode === "important") {
        const ai = a.isImportant ? 0 : 1;
        const bi = b.isImportant ? 0 : 1;
        if (ai !== bi) return ai - bi;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      // due_asc
      const ad = a.dueDate
        ? new Date(a.dueDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bd = b.dueDate
        ? new Date(b.dueDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      return ad - bd;
    });

    return tasks;
  }, [allTasks, filter, search, sortMode]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onPress={() => navigation.navigate("TaskForm", { task: item })}
      onToggleStatus={() => handleToggleStatus(item)}
    />
  );

  const cycleSort = () => {
    setSortMode((prev) => {
      if (prev === "created_desc") return "created_asc";
      if (prev === "created_asc") return "due_asc";
      if (prev === "due_asc") return "important";
      return "created_desc";
    });
  };

  const sortLabel = () => {
    switch (sortMode) {
      case "created_desc":
        return "Newest";
      case "created_asc":
        return "Oldest";
      case "due_asc":
        return "Due date";
      case "important":
        return "Important";
      default:
        return "Sort";
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#777" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search tasks..."
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["all", "pending", "done", "important"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all"
                ? "All"
                : f === "pending"
                ? "Pending"
                : f === "done"
                ? "Done"
                : "Important"}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.sortButton} onPress={cycleSort}>
          <Ionicons name="swap-vertical" size={16} color="#1e88e5" />
          <Text style={styles.sortText}>{sortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {filteredAndSorted.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No tasks match this view.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TaskForm")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e88e5",
    elevation: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#1e88e5",
    borderColor: "#1e88e5",
  },
  filterText: {
    fontSize: 12,
    color: "#555",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e88e5",
    backgroundColor: "#e3f2fd",
  },
  sortText: {
    fontSize: 12,
    color: "#1e88e5",
    marginLeft: 4,
  },
});

export default TaskListScreen;
