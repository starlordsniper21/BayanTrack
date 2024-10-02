import 'package:flutter/material.dart';
import '../models/expense.dart';

class AddExpenseScreen extends StatefulWidget {
  final Function(Expense) onAddExpense;

  AddExpenseScreen({required this.onAddExpense});

  @override
  _AddExpenseScreenState createState() => _AddExpenseScreenState();
}

class _AddExpenseScreenState extends State<AddExpenseScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _categoryController = TextEditingController();

  void _submitData() {
    final String name = _nameController.text;
    final double amount = double.tryParse(_amountController.text) ?? 0;
    final String category = _categoryController.text;

    if (name.isEmpty || amount <= 0 || category.isEmpty) {
      return; // You can add validation here
    }

    widget.onAddExpense(Expense(
      id: DateTime.now().toString(),
      name: name,
      amount: amount,
      category: category,
      date: DateTime.now(),
    ));

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Expense'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: _nameController,
                decoration: InputDecoration(labelText: 'Expense Name', border: OutlineInputBorder()),
              ),
              SizedBox(height: 10),
              TextField(
                controller: _amountController,
                decoration: InputDecoration(labelText: 'Amount', border: OutlineInputBorder()),
                keyboardType: TextInputType.number,
              ),
              SizedBox(height: 10),
              TextField(
                controller: _categoryController,
                decoration: InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitData,
                child: Text('Add Expense'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(double.infinity, 50), // Set button width to full
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
