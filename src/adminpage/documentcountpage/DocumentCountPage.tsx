import { useCallback, useEffect, useState } from "react";
import "./DocumentCount.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../stores/store";
import { DocumentCountNumber } from "../../model/docmentCount.type";
import CircleLoading from "../../shared/circleLoading";
import { getAllDocumentCounts } from "../../stores/slices/documentCountSlice";

const DocumentCountPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);

  const [documentCountData, setDocumentCountData] =
    useState<DocumentCountNumber>();

  const fetchAllDocumentCount = useCallback(async () => {
    try {
      setIsCountLoading(true);

      const DocumentCountRes = await dispath(getAllDocumentCounts()).unwrap();

      setDocumentCountData(DocumentCountRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCountLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllDocumentCount();
  }, [fetchAllDocumentCount]);

  console.log(documentCountData);

  return (
    <div className="container-DocumentCountPage">
      <div className="header-DocumentCountPage">
        <h1>เลขที่เอกสาร</h1>
      </div>

      <div className="wrap-container-DocumentCountPage">
        <div className="grid-DocumentCountPage">
          <div className="documentCountPage-content">
            <div className="bookingCount-content">
              <p>{documentCountData?.bookingCount}</p>
            </div>

            <div className="bookingCount-content">
              <p>{documentCountData?.expenseCount}</p>
            </div>
          </div>
        </div>
      </div>
      <CircleLoading open={isCountLoading} />
    </div>
  );
};

export default DocumentCountPage;
