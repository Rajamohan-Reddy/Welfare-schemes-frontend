import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationByIdApi } from "../../schemes/api/applications.api";
import {
  documentVerifyApi,
  fieldVerifyApi,
} from "../../verification/api/verification.api";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import toast from "react-hot-toast";

function OfficerReviewPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const resp = await getApplicationByIdApi(applicationId);
      setApplication(resp.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const doDocumentVerify = async () => {
    if (!remarks) {
      toast.error("Remarks required");
      return;
    }

    try {
      setActionLoading(true);
      await documentVerifyApi(applicationId, { remarks });
      toast.success("Document verification completed");
      navigate("/officer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete document verification");
    } finally {
      setActionLoading(false);
    }
  };

  const doFieldVerify = async () => {
    if (!remarks) {
      toast.error("Remarks required");
      return;
    }

    try {
      setActionLoading(true);
      await fieldVerifyApi(applicationId, { remarks });
      toast.success("Field verification completed");
      navigate("/officer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete field verification");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Officer Review</h1>

      <Card>
        <h3 className="font-semibold">Application</h3>
        <div className="mt-3">
          <pre className="max-h-72 overflow-auto">
            {JSON.stringify(application, null, 2)}
          </pre>
        </div>

        <div className="mt-4">
          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3"
            placeholder="Enter remarks (required)"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button loading={actionLoading} onClick={doDocumentVerify}>
            Document Verify
          </Button>
          <Button
            loading={actionLoading}
            variant="secondary"
            onClick={doFieldVerify}
          >
            Field Verify
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default OfficerReviewPage;
