import Loan from "../models/loan.js";

export const getLoans = async (req, res) => {
  try {
    let loans;
    if (req.user.user_type === "admin") {
      loans = await Loan.find().populate("user_id");
    } else {
      loans = await Loan.find({ user_id: req.user._id });
    }
    return res.status(200).json({ Loans: loans });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const { amount, terms } = req.body;
    const loan = new Loan({
      user_id: req.user._id,
      amount: parseInt(amount),
      terms: parseInt(terms),
      repayments: [],
      remainingAmount: amount,
    });

    // Generate scheduled repayments
    const repaymentAmount = Math.round(amount / terms);
    const today = new Date();
    for (let i = 0; i < terms; i++) {
      const repaymentDate = new Date(today);
      repaymentDate.setDate(today.getDate() + 7 * (i + 1));
      loan.repayments.push({
        date: repaymentDate.toISOString().slice(0, 10),
        amount: repaymentAmount,
      });
    }

    await loan.save();
    return res.status(201).json({ loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    if (req.user.user_type !== "admin") throw new Error("You are not authorized");
    const { id, status } = req.body;
    const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true });
    if (!loan) throw new Error("Loan not found");
    return res.status(200).json({ msg: "Status updated!", loan });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const repayLoan = async (req, res) => {
  try {
    const { loanId, installmentId, additionalAmount } = req.body;

    // Validate input data
    if (!additionalAmount && additionalAmount !== 0) {
      throw new Error("Additional amount is required");
    }

    // Fetch the loan from the database based on loanId
    const loan = await Loan.findById(loanId);
    if (!loan) {
      throw new Error("Loan not found");
    }

    // Find the installment within the loan
    const installment = loan.repayments.id(installmentId);
    if (!installment) {
      throw new Error("Installment not found");
    }

    // Check if the installment has already been paid
    if (installment.status === "paid") {
      throw new Error("Installment already marked as paid");
    }


    if (installment.status !== "paid") {
      const totalRemainingAmount = loan.repayments.reduce((total, inst) => {
        if (inst._id.toString() !== installmentId.toString() && inst.status !== "paid") {
          return total + inst.amount;
        }
        return total;
      }, 0);

      // Calculate the ratio of the additional amount to the total remaining amount
      const ratio = additionalAmount / totalRemainingAmount;

      // Distribute the additional amount proportionally among the remaining installments
      loan.repayments.forEach(inst => {
        if (inst._id.toString() !== installmentId.toString() && inst.status !== "paid") {
          inst.amount -= Math.round(inst.amount * ratio);
        }
      });

      // Add the additional amount to the paid installment
      installment.amount += additionalAmount;
      installment.status = "paid";

      // Recalculate the remaining amount based on the updated installment amounts and statuses
      loan.remainingAmount = loan.repayments.reduce((total, inst) => {
        if (inst.status !== "paid") {
          return total + inst.amount;
        }
        return total;
      }, 0);

      // If remaining amount is zero, mark all remaining installments as paid
      if (loan.remainingAmount <= 0) {
        loan.repayments.forEach(inst => {
          if (inst.status !== "paid") {
            inst.status = "paid";
          }
        });
      }

      await loan.save();

      return res.status(200).json({ msg: "Installment paid" });
    } else {
      return res.status(400).json({ error: "Installment already marked as paid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting loan with ID:", id); // Log the ID for debugging
    const deletedLoan = await Loan.findByIdAndDelete(id);
    if (!deletedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    return res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan:", error); // Log the error for debugging
    return res.status(500).json({ error: "Server error" });
  }
};