import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet, View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as Network from "expo-network";

import Vision from "./Vision";

export default function App() {
  const [credentials, setCredentials] = useState(null);
  const [connected, setConnected] = useState(true);
  const checkConnection = async () => {
    const { isConnected } = await Network.getNetworkStateAsync();
    if (!isConnected) {
      console.log("not connected");
    }
    setConnected(isConnected);
  };

  setInterval(checkConnection, 1000);

  return (
    <View style={{ flex: 1 }}>
      {credentials && connected ? (
        <Vision
          user={credentials.user || true}
          setCredentials={setCredentials}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Text
            style={{
              fontSize: 40,
              marginBottom: 20,
            }}
          >
            Pinecone Vision
          </Text>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={styles.button}
            onPress={async () => {
              try {
                const creds = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
                // signed in
                setCredentials(creds);
              } catch (e) {
                if (e.code === "ERR_CANCELED") {
                  // handle that the user canceled the sign-in flow
                } else {
                  // handle other errors
                }
              }
            }}
          />
        </View>
      )}

      {!connected && (
        <View style={styles.buttonContainer}>
          <Text style={{ fontSize: 40, marginBottom: 20 }}>
            Cannot connect to server
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  //Justify content center
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});
