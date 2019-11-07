﻿using FluentValidation;

namespace PxStat.Data
{
    /// <summary>
    /// Search validator
    /// </summary>
    internal class Classification_VLD_Search : AbstractValidator<Classification_DTO_Search>
    {
        internal Classification_VLD_Search()
        {
            //Mandatory - Search
            RuleFor(f => f.Search).NotEmpty().Length(1, 256);
            //Optional - LngIsoCode
            RuleFor(f => f.LngIsoCode.Length).Equal(2).When(f => !string.IsNullOrEmpty(f.LngIsoCode)).WithMessage("Invalid ISO code").WithName("LanguageIsoCodeValidation");
        }
    }

    /// <summary>
    /// Read validator
    /// </summary>
    internal class Classification_VLD_Read : AbstractValidator<Classification_DTO_Read>
    {
        internal Classification_VLD_Read() { }
    }
}