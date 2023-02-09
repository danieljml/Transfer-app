import "./App.css";
import React, { useEffect, useState } from "react";

const CustomerSelection = ({ customers, onCustomerSelection }) => {
  return (
    <section id="current-customer">
      <h2 className="title">Current Customer</h2>
      <select
        defaultValue={"none"}
        onChange={(e) => onCustomerSelection(e)}
        id="customer-selection"
        name="customer-selection"
      >
        <option value="none">Select an option</option>
        {Object.entries(customers || {}).map((customer) => {
          const [customerIdentifier] = customer;
          return <option key={customerIdentifier}>{customerIdentifier}</option>;
        })}
      </select>
    </section>
  );
};

const Accounts = ({ currentCustomer }) => {
  const accountTypes = ["savings", "checking"];
  return (
    <section id="accounts">
      <h2 className="title">Accounts</h2>
      <div className="container__accounts">
        {currentCustomer && currentCustomer?.accountOwner !== "none"
          ? Object.entries(currentCustomer || {}).map((account) =>
              account[0] !== "accountOwner" ? (
                <div key={account[0]} className="account">
                  <span className="title">Account {account[0]}</span>
                  <span className="amount">
                    {(Number.parseFloat(account[1]) / 100).toFixed(2)}
                  </span>
                </div>
              ) : (
                ""
              )
            )
          : accountTypes.map((account) => {
              return (
                <div key={account[0]} className="account">
                  <span className="title">Account {account}</span>
                  <span className="amount">N.NN</span>
                </div>
              );
            })}
      </div>
    </section>
  );
};

const TransferActions = ({
  amount,
  setAmount,
  customerToTransfer,
  setCustomerToTransfer,
  selectFilter
}) => {
  return (
    <section id="transfer">
      <h2 className="title">Transfer Money</h2>
      <input
        type="number"
        placeholder="Amount"
        className="tranfer__amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="container__selects">
        <select
          id="from-account"
          name="from-account"
          onChange={(e) =>
            setCustomerToTransfer({
              ...customerToTransfer,
              fromAccount: e.target.value
            })
          }
        >
          <option value="">From Account</option>
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
        </select>
        <select
          id="to-customer"
          name="to-customer"
          onChange={(e) =>
            setCustomerToTransfer({
              ...customerToTransfer,
              toAccount: e.target.value
            })
          }
        >
          <option value="">To Account</option>
          {Object.keys(selectFilter).map((item, i) => {
            return (
              <option key={i} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select
          id="account"
          name="account"
          className="app__transfer"
          onChange={(e) =>
            setCustomerToTransfer({
              ...customerToTransfer,
              accounType: e.target.value
            })
          }
        >
          <option value="">Account</option>
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
        </select>
      </div>
    </section>
  );
};

const TransferConfirmation = ({
  transfer,
  customerAmount,
  customerToTransfer
}) => {
  return (
    <>
      <h2 className="title">Final Amounts</h2>
      <section className="transfer-confirmation">
        <div className="from-account">
          <span className="account-name">Account </span>
          <span className="amount">
            {Number(customerAmount) <= 0 ? "0  N.NN" : Number(customerAmount)}
          </span>
        </div>
        <i className="bx bx-right-arrow-alt"></i>
        <div className="to-account">
          <span className="account-name">Customer Account </span>
          <span className="amount">
            {Number(customerToTransfer) <= 0
              ? "0  N.NN"
              : Number(customerToTransfer)}
          </span>
        </div>
        <button onClick={() => transfer()} className="confirmation__btn">
          Transfer
        </button>
      </section>
    </>
  );
};

const App = () => {
  const [customers, setCustomers] = useState({
    Caterpie: {
      checking: 5000,
      savings: 100
    },
    Charmander: {
      checking: 50000,
      savings: 0
    },
    Squirtle: {
      checking: 1000,
      savings: 10000
    },
    Bulbasaur: {
      checking: 7500,
      savings: 10000
    }
  });
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [customerAmount, setCustomerAmount] = useState(0);
  const [selectFilter, setSelectFilter] = useState("");

  const [customerToTransfer, setCustomerToTransfer] = useState({
    fromAccount: null,
    toAccount: null,
    accounType: null
  });

  const onCustomerSelection = (selection) => {
    const customerIdentifier = selection.target.value;
    setCurrentCustomer({
      ...customers[customerIdentifier],
      accountOwner: customerIdentifier
    });
    setSelectFilter(
      Object.fromEntries(
        Object.entries(customers).filter(
          (account) => account[0] !== customerIdentifier
        )
      )
    );
  };

  const numberFixed = (num) => (Number.parseFloat(num) / 100).toFixed(2);

  useEffect(() => {
    const areTransctionValues = [
      customerToTransfer?.toAccount,
      customerToTransfer?.accounType,
      customerToTransfer?.fromAccount,
      amount
    ].every((account) => account || account > 0);

    if (areTransctionValues && currentCustomer.accountOwner !== "none") {
      let customerAmountNum =
        Number(
          numberFixed(
            customers[currentCustomer?.accountOwner][
              customerToTransfer?.fromAccount
            ]
          )
        ) - Number(amount);

      let transferAmount =
        Number(
          numberFixed(
            customers[customerToTransfer?.toAccount][
              customerToTransfer?.accounType
            ]
          )
        ) + Number(amount);

      setTransferAmount(transferAmount);
      setCustomerAmount(customerAmountNum);
    }
  }, [customerToTransfer, amount, currentCustomer, customers]);

  const transfer = () => {
    const areTransctionValues = [
      customerToTransfer?.toAccount,
      customerToTransfer?.accounType,
      customerToTransfer?.fromAccount,
      amount
    ].every((account) => account || account > 0);

    if (areTransctionValues && currentCustomer) {
      customers[currentCustomer?.accountOwner][
        customerToTransfer?.fromAccount
      ] = customerAmount * 100;
      customers[customerToTransfer?.toAccount][customerToTransfer?.accounType] =
        transferAmount * 100;

      setAmount("");
      setTransferAmount(0);
      setCustomerAmount(0);
      setCustomers({ ...customers });
      setCurrentCustomer({
        ...customers[currentCustomer?.accountOwner],
        accountOwner: currentCustomer?.accountOwner
      });
    }
  };

  return (
    <div className="application">
      <CustomerSelection
        customers={customers}
        onCustomerSelection={onCustomerSelection}
      />
      <Accounts currentCustomer={currentCustomer} />
      <TransferActions
        amount={amount}
        setAmount={setAmount}
        currentCustomer={currentCustomer}
        customers={customers}
        setCustomers={setCustomers}
        customerToTransfer={customerToTransfer}
        setCustomerToTransfer={setCustomerToTransfer}
        selectFilter={selectFilter}
      />
      <TransferConfirmation
        customerToTransfer={transferAmount}
        customerAmount={customerAmount}
        transfer={transfer}
      />
    </div>
  );
};

export default App;
