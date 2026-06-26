import CompanySettings from "~/app/_components/@molecules/CompanySettings";
import ShippingAddresses from "~/app/_components/@molecules/ShippingAddresses";

const SettingsPage = async () => {
  return (
    <div className="flex">
      <div className="flex-grow p-6">
        <h1 className="mb-4 text-2xl font-bold">Date companie</h1>
        <CompanySettings />
        <ShippingAddresses />
      </div>
    </div>
  );
};

export default SettingsPage;
