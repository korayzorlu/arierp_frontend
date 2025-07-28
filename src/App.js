import './App.css';
import React, {useEffect, useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './features/layout/pages/Landing.js';
import Panel from './features/layout/pages/Panel.js';
import WrongPath from './features/layout/pages/WrongPath.js';
import Home from './features/layout/pages/Home.js';

import axios from 'axios';
import Loading from './component/loading/Loading.js';
import Settings from './features/settings/pages/Settings.js';
import Profile from './features/auth/pages/Profile.js'
import Auth from './features/auth/pages/Auth.js';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Company from './features/organization/pages/Companies.js';
import PasswordReset from './features/settings/auth/pages/PasswordReset.js';
import AuthSettingsLinks from './features/settings/auth/pages/AuthSettingsLinks.js';
import ProfileSettings from './features/settings/auth/pages/ProfileSettings.js';
import PersonalSettings from './features/settings/auth/pages/PersonalSettings.js';
import EmailSettings from './features/settings/auth/pages/EmailSettings.js';
import ForgotPassword from './features/auth/pages/ForgotPassword.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, fetchTheme, fetchCSRFToken, setLoading } from './store/slices/authSlice.js';
import { checkMobile, setResize } from './store/slices/sidebarSlice.js';
import AddCompany from './features/organization/pages/AddCompany.js';
import UpdateCompany from './features/organization/pages/UpdateCompany.js';
//import { ThemeProvider } from '@emotion/react'
import CariHesapHareketleri from './features/mikro/pages/CariHesapHareketleri.js';
import Personeller from './features/mikro/pages/Personeller.js';
import Partners from './features/partners/pages/Partners.js';
import { setNavigate } from './store/store.js';
import PersonelTahakkuklari from './features/mikro/pages/PersonelTahakkuklari.js';
import Notification from './features/notification/pages/Notification.js';
import Invitations from './features/organization/pages/Invitations.js';
import PhoneNumberSettings from './features/settings/auth/pages/PhoneNumberSettings.js';
import PhoneNumberVerify from './features/settings/auth/pages/PhoneNumberVerify.js';
import EmailVerify from './features/settings/auth/pages/EmailVerify.js';
import UpdatePartner from './features/partners/pages/UpdatePartner.js';
import AddPartner from './features/partners/pages/AddPartner.js';
import { ThemeProvider } from './ThemeProvider.js';
import Dashboard from './features/dashboard/pages/Dashboard.js';
import Accounts from './features/accounting/account/pages/Accounts.js';
import AddAccount from './features/accounting/account/pages/AddAccount.js';
import UpdateAccount from './features/accounting/account/pages/UpdateAccount.js';
import Invoices from './features/accounting/invoice/pages/Invoices.js';
import AddInvoice from './features/accounting/invoice/pages/AddInvoice.js';
import UpdateInvoice from './features/accounting/invoice/pages/UpdateInvoice.js';
import Payments from './features/accounting/payment/pages/Payments.js';
import AddPayment from './features/accounting/payment/pages/AddPayment.js';
import UpdatePayment from './features/accounting/payment/pages/UpdatePayment.js';
import Receivable from './features/accounting/account/components/Receivable.js';
import Payable from './features/accounting/account/components/Payable.js';
import Sales from './features/accounting/account/components/Sales.js';
import OrganizationSettingsLink from './features/settings/organization/pages/OrganizationSettingsLink.js';
import CurrencySettings from './features/settings/organization/pages/CurrencySettings.js';
import Expenses from './features/accounting/account/components/Expenses.js';
import Expense from './features/accounting/account/components/Expense.js';
import Bank from './features/accounting/account/components/Bank.js';
import Cash from './features/accounting/account/components/Cash.js';
import Capital from './features/accounting/account/components/Capital.js';
import Categories from './features/products/category/pages/Categories.js';
import AddCategory from './features/products/category/components/AddCategory.js';
import UpdateCategory from './features/products/category/components/UpdateCategory.js';
import BankaTahsilatlari from './features/converters/pages/BankaTahsilatlari.js';
import BankaTahsilatlariOdoo from './features/converters/pages/BankaTahsilatlariOdoo.js';
import BankaHareketleri from './features/converters/pages/BankaHareketleri.js';

import { LicenseInfo } from '@mui/x-license';
import Sectors from './features/partners/pages/Sectors.js';
import AddSector from './features/partners/pages/AddSector.js';
import UpdateSector from './features/partners/pages/UpdateSector.js';
import Contracts from './features/contracts/pages/Contracts.js';
import Leases from './features/leasing/pages/Leases.js';
import { setAlert } from './store/slices/notificationSlice.js';
import QuickQuotations from './features/quotations/pages/QuickQuotations.js';
import Quotations from './features/quotations/pages/Quotations.js';
import Installment from './features/leasing/pages/Installment.js';
import TradeAccounts from './features/trade/pages/TradeAccounts.js';
import LedgerAccounts from './features/ledger/pages/LedgerAccounts.js';
import AddLease from './features/leasing/pages/AddLease.js';
import UpdateLease from './features/leasing/pages/UpdateLease.js';
import Collections from './features/leasing/pages/Collections.js';
import RiskPartners from './features/leasing/pages/RiskPartners.js';
import ContractPayments from './features/contracts/pages/ContractPayments.js';
import OverdueLeases from './features/leasing/pages/OverdueLeases.js';
import WarningNotices from './features/leasing/pages/WarningNotices.js';
import TomorrowPartners from './features/leasing/pages/TomorrowPartners.js';
import TodayPartners from './features/leasing/pages/TodayPartners.js';
import RiskPartnersKDV from './features/leasing/pages/RiskPartnersKDV.js';
import ToWarnedRiskPartners from './features/leasing/pages/ToWarnedRiskPartners.js';
import ToTerminatedRiskPartners from './features/leasing/pages/ToTerminatedRiskPartners.js';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE_KEY);

export const NumberContext = React.createContext();

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  const {user,status,theme,dark,loading} = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get user from api

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    //fetchTheme();
    dispatch(fetchTheme(theme));
  }, [dark,dispatch]);
  
  useEffect(() => {
    const fetchData = async () => {
      try{
        await dispatch(fetchUser()).unwrap();
        await dispatch(fetchCSRFToken()).unwrap();
      }catch(error){}
      
      dispatch(setLoading(false));
    };
    
    fetchData();

  },[dispatch]);

  //sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      dispatch(setResize());
    };

    dispatch(checkMobile());
    window.addEventListener('resize', handleResize);

    // Temizlik işlevi
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  //session kontrolü
  // const [timeoutWarningTime, setTimeoutWarningTime] = useState(10);
  // const [sessionTimeout, setSessionTimeout] = useState(15);

  // const warningTimer = setTimeout(() => {
  //   dispatch(setAlert({status:"warning",text:"Removing items.."}));
  // },timeoutWarningTime);

  //   const logoutTimer = setTimeout(() => {
  //   dispatch(setAlert({status:"warning",text:"Removing items.."}));
  // },sessionTimeout);

  // document.addEventListener("mousemove", () => {
  //   clearTimeout(warningTimer);
  //   clearTimeout(logoutTimer);
  // });

  // document.addEventListener("keydown", () => {
  //   clearTimeout(warningTimer);
  //   clearTimeout(logoutTimer);
  // });

  if (loading) return <Loading></Loading>;

  if (user && !user.is_email_verified) return (
    <ThemeProvider>
      <EmailVerify></EmailVerify>
    </ThemeProvider>
  );

 

  return (
    <ThemeProvider>
        <div className="App" id='Marswide'>

          { user && status
          ? 
            <>
              <Routes>

                <Route exact path='/' element={<Panel></Panel>}>
                  <Route index element={<Dashboard></Dashboard>}></Route>
                  <Route path='profile/:username' element={<Profile></Profile>}></Route>
                  <Route path='notification' element={<Notification></Notification>}></Route>

                  <Route path='settings' element={<Settings></Settings>}>
                    <Route path='auth' element={<AuthSettingsLinks></AuthSettingsLinks>}></Route>
                    <Route path='auth/profile' element={<ProfileSettings></ProfileSettings>}></Route>
                    <Route path='auth/personal' element={<PersonalSettings></PersonalSettings>}></Route>
                    <Route path='auth/email' element={<EmailSettings></EmailSettings>}></Route>
                    <Route path='auth/phone-number' element={<PhoneNumberSettings></PhoneNumberSettings>}></Route>
                    <Route path='auth/password-reset' element={<PasswordReset></PasswordReset>}></Route>
                    <Route path='organization' element={<OrganizationSettingsLink></OrganizationSettingsLink>}></Route>
                    <Route path='organization/currency' element={<CurrencySettings></CurrencySettings>}></Route>
                  </Route>
                  <Route path='phone-number-verify' element={<PhoneNumberVerify></PhoneNumberVerify>}></Route>

                  <Route path='/companies' element={<Company></Company>}></Route>
                  <Route path='/companies/add-company' element={<AddCompany></AddCompany>}></Route>
                  <Route path='/companies/update/:name' element={<UpdateCompany></UpdateCompany>}></Route>
                  <Route path='/invitations' element={<Invitations></Invitations>}></Route>

                  <Route path='/sectors' element={<Sectors></Sectors>}></Route>
                  <Route path='/partners/add-sector' element={<AddSector></AddSector>}></Route>
                  <Route path='/partners/update-sector/:uuid' element={<UpdateSector></UpdateSector>}></Route>

                  <Route path='/partners' element={<Partners></Partners>}></Route>
                  <Route path='/partners/add-partner' element={<AddPartner></AddPartner>}></Route>
                  <Route path='/partners/update/:uuid' element={<UpdatePartner></UpdatePartner>}></Route>

                  <Route path='/categories' element={<Categories></Categories>}>
                    <Route path='add-category' element={<AddCategory></AddCategory>}></Route>
                    <Route path='update/:uuid' element={<UpdateCategory></UpdateCategory>}></Route>
                  </Route>
                  
                  <Route path='/products/update/:uuid' element={<UpdateCategory></UpdateCategory>}></Route>

                  <Route path='/contracts' element={<Contracts></Contracts>}></Route>
                  <Route path='/contract-payments' element={<ContractPayments></ContractPayments>}></Route>

                  <Route path='/leases' element={<Leases></Leases>}></Route>
                  <Route path='/leasing/add-lease' element={<AddLease></AddLease>}></Route>
                  <Route path='/leasing/update/:uuid/:contract_code' element={<UpdateLease></UpdateLease>}></Route>
                  <Route path='/installments' element={<Installment></Installment>}></Route>
                  <Route path='/collections' element={<Collections></Collections>}></Route>

                  <Route path='/overdue-leases' element={<OverdueLeases></OverdueLeases>}></Route>
                  <Route path='/risk-partners' element={<RiskPartners></RiskPartners>}></Route>
                  <Route path='/kdv-risk-partners' element={<RiskPartnersKDV></RiskPartnersKDV>}></Route>
                  <Route path='/to-warned-risk-partners' element={<ToWarnedRiskPartners></ToWarnedRiskPartners>}></Route>
                  <Route path='/to-terminated-risk-partners' element={<ToTerminatedRiskPartners></ToTerminatedRiskPartners>}></Route>
                  <Route path='/tomorrow-partners' element={<TomorrowPartners></TomorrowPartners>}></Route>
                  <Route path='/today-partners' element={<TodayPartners></TodayPartners>}></Route>
                  <Route path='/warning-notices' element={<WarningNotices></WarningNotices>}></Route>

                  <Route path='/quick-quotations' element={<QuickQuotations></QuickQuotations>}></Route>
                  <Route path='/quotations' element={<Quotations></Quotations>}></Route>

                  <Route path='/trade-accounts' element={<TradeAccounts></TradeAccounts>}></Route>

                  <Route path='/ledger-accounts' element={<LedgerAccounts></LedgerAccounts>}></Route>

                  <Route path='/accounts' element={<Accounts></Accounts>}></Route>
                  <Route path='/accounts/accounts-receivable' element={<Receivable></Receivable>}></Route>
                  <Route path='/accounts/accounts-payable' element={<Payable></Payable>}></Route>
                  <Route path='/accounts/bank' element={<Bank></Bank>}></Route>
                  <Route path='/accounts/cash' element={<Cash></Cash>}></Route>
                  <Route path='/accounts/sales' element={<Sales></Sales>}></Route>
                  <Route path='/accounts/capital' element={<Capital></Capital>}></Route>
                  <Route path='/accounts/expense' element={<Expense></Expense>}></Route>
                  <Route path='/accounts/add-account/:type' element={<AddAccount></AddAccount>}></Route>
                  <Route path='/accounts/update/:type/:uuid' element={<UpdateAccount></UpdateAccount>}></Route>

                  <Route path='/invoices' element={<Invoices></Invoices>}></Route>
                  <Route path='/invoices/add-invoice/:type' element={<AddInvoice></AddInvoice>}></Route>
                  <Route path='/invoices/update/:type/:uuid' element={<UpdateInvoice></UpdateInvoice>}></Route>

                  <Route path='/payments' element={<Payments></Payments>}></Route>
                  <Route path='/payments/add-payment/:type' element={<AddPayment></AddPayment>}></Route>
                  <Route path='/payments/update/:type/:uuid' element={<UpdatePayment></UpdatePayment>}></Route>

                  <Route path='/banka-hareketleri' element={<BankaHareketleri></BankaHareketleri>}></Route>
                  <Route path='/banka-tahsilatlari' element={<BankaTahsilatlari></BankaTahsilatlari>}></Route>
                  <Route path='/banka--tahsilatlari-odoo' element={<BankaTahsilatlariOdoo></BankaTahsilatlariOdoo>}></Route>

                  <Route path='auth' element={<Dashboard></Dashboard>}>
                    <Route path='login'></Route>
                    <Route path='register'></Route>
                  </Route>

                </Route>

                <Route path='*' element={<WrongPath></WrongPath>}></Route>

              </Routes>
            </>
          :
            <>
              <Routes>

                <Route path='/' element={<Landing></Landing>}>
                  <Route index element={<Home></Home>}></Route>
                  <Route path='auth' element={<Auth></Auth>}>
                    <Route path='login' element={<Login></Login>}></Route>
                    <Route path='register' element={<Register></Register>}></Route>
                    <Route path='forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
                  </Route>
                </Route>

                <Route path='*' element={<WrongPath></WrongPath>}></Route>

              </Routes>
            </>
          }

        </div>
      
    </ThemeProvider>
    
  );
}

export default App;
