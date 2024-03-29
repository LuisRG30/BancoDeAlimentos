import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Input } from "@rneui/base";

import { Session } from "@supabase/supabase-js";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DonationScreen from "./DonationScreen";
import ProfileScreen from "./ProfileScreen";

interface iAccountProps {
  DonationModal?: boolean;
}

export default function AccountScreen(
  { session }: { session: Session },
  props: iAccountProps
) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        name="Perfil 👤"
      >
        {() => <ProfileScreen session={session} />}
      </Tab.Screen>
      <Tab.Screen
        name="Donaciones 🍲"
        component={DonationScreen}
        options={{
          tabBarLabel: "Donar",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
