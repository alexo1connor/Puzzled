import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

const ItemComponent = React.forwardRef(({ id }, ref) => {
  return (
    <View ref={ref} style={styles.item}>
            <Text>Item ID: {id}</Text>   {" "}
    </View>
  );
});

export default function MyList() {
  const itemRefs = useRef({});

  const handlePress = (id) => {
    // Now access the ref using the correct id
    const componentRef = itemRefs.current[id];
    if (componentRef) {
      console.log(`Ref for item with id ${id} is available!`); // You can now manipulate the native component
    } else {
      console.log(`Ref for item with id ${id} is NOT available.`);
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <ItemComponent
          key={item.id}
          id={item.id}
          ref={(el) => (itemRefs.current[item.id] = el)}
        />
      ))}
      <View style={styles.buttonContainer}>
        {items.map((item) => (
          <Text
            key={item.id}
            onPress={() => handlePress(item.id)} // Pass item.id
            style={styles.button}
          >
                        Access Item {item.id} Ref          {" "}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  item: {
    width: 150,
    height: 50,
    margin: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    textAlign: "center",
  },
});
