import 'package:flutter/material.dart';
import '../models/expense.dart';

class ExpenseList extends StatelessWidget {
  final List<Expense> expenses;
  final Function(String) deleteExpense;

  ExpenseList({required this.expenses, required this.deleteExpense});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: expenses.length,
      itemBuilder: (context, index) {
        Expense expense = expenses[index];
        return Card(
          elevation: 5,
          margin: EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: Text(expense.name),
            subtitle: Text('${expense.amount} - ${expense.category}'),
            trailing: IconButton(
              icon: Icon(Icons.delete),
              onPressed: () => deleteExpense(expense.id),
              color: Colors.red,
            ),
          ),
        );
      },
    );
  }
}
