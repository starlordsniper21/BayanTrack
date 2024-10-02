import 'package:flutter/material.dart';
import 'add_expense_screen.dart';
import '../models/expense.dart';
import '../widgets/expense_list.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Expense> _expenses = [];

  void _addExpense(Expense expense) {
    setState(() {
      _expenses.add(expense);
    });
  }

  void _deleteExpense(String id) {
    setState(() {
      _expenses.removeWhere((expense) => expense.id == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('BayanTrack - Expenses'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(child: ExpenseList(expenses: _expenses, deleteExpense: _deleteExpense)),
            SizedBox(height: 10),
            FloatingActionButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => AddExpenseScreen(onAddExpense: _addExpense),
                  ),
                );
              },
              child: Icon(Icons.add),
            ),
          ],
        ),
      ),
    );
  }
}
