import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import Auth from "./screens/Auth";
import AccountScreen from "./screens/Account";
import SendDonation from "./screens/SendDonation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DonationScreen from "./screens/DonationScreen";

export default function App() {
  const [imageSwitch, setImageSwitch] = React.useState(false);

  const Stack = createNativeStackNavigator();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {session ? (
            <Stack.Screen name="Account">
              {(props) => (
                <AccountScreen
                  key={session.user.id}
                  {...props}
                  session={session}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth">{(props) => <Auth />}</Stack.Screen>
          )}
          <Stack.Screen name="AuthScreen" component={Auth} />
          <Stack.Screen name="Enviar donación" component={SendDonation} />
          <Stack.Screen name="DonationScreen" component={DonationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
