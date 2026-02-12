import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BackIcon } from "./icons/BackIcon";

type Props = {
  title: string;
  showAddBtn?: boolean;
  onAddPress?: () => void;
  showBackBtn?: boolean;
  onBackPress?: () => void;
  isGift?: boolean;
};

export default function HeaderComponent({
  title = "",
  showAddBtn = true,
  onAddPress = () => {},
  showBackBtn = false,
  onBackPress = () => {},
}: Props) {

  return (
    <View style={styles.container}>
      {showBackBtn ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtnPlaceholder} />
      )}

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {showAddBtn ? (
        <TouchableOpacity onPress={onAddPress} style={styles.addBtn}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addBtnPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backBtn: {
    padding: 8,
    minWidth: 40,
    alignItems: 'flex-start',
  },
  backBtnPlaceholder: {
    minWidth: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  menuBtn: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#01579B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  addBtn: {
    padding: 8,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  addBtnPlaceholder: {
    minWidth: 40,
  },
  addIcon: {
    fontSize: 28,
    color: '#00BCD4',
    fontWeight: '300',
  },
  giftBtn: {
    padding: 8,
  },
  giftText: {
    fontSize: 20,
    color: '#01579B',
  },
});
