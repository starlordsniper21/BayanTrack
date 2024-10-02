import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(BayanTrackApp());
}

class BayanTrackApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BayanTrack',
      theme: ThemeData(
        primaryColor: Colors.blueAccent,
        hintColor: Colors.orangeAccent,
        textTheme: TextTheme(
          bodyLarge: TextStyle(color: Colors.black87),
          bodyMedium: TextStyle(color: Colors.black54),
        ),
      ),
      home: HomeScreen(),
    );
  }
}
