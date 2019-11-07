SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Paulo Patricio
-- Create date: 27 Sep 2018
-- Description:	Returns records from the Format Table
-- =============================================
CREATE
	OR

ALTER PROCEDURE System_Settings_Format_Read @FrmType NVARCHAR(32) = NULL
	,@FrmVersion NVARCHAR(32) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	SELECT FRM_TYPE AS FrmType
		,FRM_VERSION AS FrmVersion
	FROM TS_FORMAT
	WHERE (
			@FrmType IS NULL
			OR FRM_TYPE = @FrmType
			)
		AND (
			@FrmVersion IS NULL
			OR FRM_VERSION = @FrmVersion
			)
END
GO


