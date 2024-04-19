import { Pressable, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";

function ProfileScreen() {
  return (
    <View>
      <Text>Profile</Text>
      <Pressable onPress={async () => await supabase.auth.signOut()}>
        <Text style={{ textAlign: "center" }}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export default ProfileScreen;
