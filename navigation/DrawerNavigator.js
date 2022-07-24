import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import Profile from "../screens/Profile";

const Drawer = createDrawerNavigator();

const DrawerNavitagor = () => {
  return(
    <Drawer.Navigator>
      <Drawer.Screen name = "Tela Inicial" component={TabNavigator}/>
      <Drawer.Screen name = "Perfil" component={Profile}/>
    </Drawer.Navigator>
  )
}

export default DrawerNavitagor;


