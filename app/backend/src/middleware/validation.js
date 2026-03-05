const Joi = require('joi');
const logger = require('../utils/logger');

// Validation schemas
const schemas = {
  article: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Le titre est requis',
      'string.min': 'Le titre doit contenir au moins 1 caractère',
      'string.max': 'Le titre ne peut pas dépasser 255 caractères',
      'any.required': 'Le titre est requis'
    }),
    slug: Joi.string().min(1).max(255).optional().messages({
      'string.empty': 'Le slug ne peut pas être vide',
      'string.max': 'Le slug ne peut pas dépasser 255 caractères'
    }),
    excerpt: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'L\'extrait ne peut pas dépasser 500 caractères'
    }),
    content: Joi.string().min(1).required().messages({
      'string.empty': 'Le contenu est requis',
      'any.required': 'Le contenu est requis'
    }),
    featured_image: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL de l\'image n\'est pas valide'
    }),
    category_id: Joi.string().uuid().optional().allow(null).messages({
      'string.uuid': 'L\'ID de la catégorie n\'est pas valide'
    }),
    status: Joi.string().valid('draft', 'published', 'archived').optional().default('draft').messages({
      'any.only': 'Le statut doit être l\'un des suivants: draft, published, archived'
    }),
    featured: Joi.boolean().optional().default(false).messages({
      'boolean.base': 'Le champ featured doit être un booléen'
    })
  }),

  user: Joi.object({
    first_name: Joi.string().min(1).max(100).optional().messages({
      'string.empty': 'Le prénom ne peut pas être vide',
      'string.max': 'Le prénom ne peut pas dépasser 100 caractères'
    }),
    last_name: Joi.string().min(1).max(100).optional().messages({
      'string.empty': 'Le nom ne peut pas être vide',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères'
    }),
    phone: Joi.string().max(20).optional().allow('').messages({
      'string.max': 'Le numéro de téléphone ne peut pas dépasser 20 caractères'
    }),
    country: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'Le pays est requis',
      'string.max': 'Le pays ne peut pas dépasser 100 caractères',
      'any.required': 'Le pays est requis'
    }),
    function: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'La fonction est requise',
      'string.max': 'La fonction ne peut pas dépasser 255 caractères',
      'any.required': 'La fonction est requise'
    }),
    sector: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Le secteur d\'activité est requis',
      'string.max': 'Le secteur d\'activité ne peut pas dépasser 255 caractères',
      'any.required': 'Le secteur d\'activité est requis'
    }),
    organization: Joi.string().max(255).optional().allow('').messages({
      'string.max': 'L\'organisation ne peut pas dépasser 255 caractères'
    }),
    bio: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'La biographie ne peut pas dépasser 1000 caractères'
    }),
    avatar_url: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL de l\'avatar n\'est pas valide'
    })
  }),

  event: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Le titre est requis',
      'string.max': 'Le titre ne peut pas dépasser 255 caractères',
      'any.required': 'Le titre est requis'
    }),
    slug: Joi.string().min(1).max(255).optional().messages({
      'string.empty': 'Le slug ne peut pas être vide',
      'string.max': 'Le slug ne peut pas dépasser 255 caractères'
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères'
    }),
    content: Joi.string().optional().allow(''),
    featured_image: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL de l\'image n\'est pas valide'
    }),
    category_id: Joi.string().uuid().optional().allow(null).messages({
      'string.uuid': 'L\'ID de la catégorie n\'est pas valide'
    }),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional().default('upcoming').messages({
      'any.only': 'Le statut doit être l\'un des suivants: upcoming, ongoing, completed, cancelled'
    }),
    event_type: Joi.string().max(50).optional().default('conference').messages({
      'string.max': 'Le type d\'événement ne peut pas dépasser 50 caractères'
    }),
    start_date: Joi.date().required().messages({
      'date.base': 'La date de début doit être une date valide',
      'any.required': 'La date de début est requise'
    }),
    end_date: Joi.date().optional().allow(null).messages({
      'date.base': 'La date de fin doit être une date valide'
    }),
    location: Joi.string().max(255).optional().allow('').messages({
      'string.max': 'Le lieu ne peut pas dépasser 255 caractères'
    }),
    location_url: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL du lieu n\'est pas valide'
    }),
    max_participants: Joi.number().integer().min(1).optional().messages({
      'number.base': 'Le nombre maximum de participants doit être un nombre',
      'number.integer': 'Le nombre maximum de participants doit être un entier',
      'number.min': 'Le nombre maximum de participants doit être au moins 1'
    }),
    registration_deadline: Joi.date().optional().allow(null).messages({
      'date.base': 'La date limite d\'inscription doit être une date valide'
    }),
    is_online: Joi.boolean().optional().default(false).messages({
      'boolean.base': 'Le champ is_online doit être un booléen'
    }),
    meeting_url: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL de la réunion n\'est pas valide'
    }),
    meeting_id: Joi.string().max(255).optional().allow('').messages({
      'string.max': 'L\'ID de la réunion ne peut pas dépasser 255 caractères'
    })
  }),

  project: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Le titre est requis',
      'string.max': 'Le titre ne peut pas dépasser 255 caractères',
      'any.required': 'Le titre est requis'
    }),
    slug: Joi.string().min(1).max(255).optional().messages({
      'string.empty': 'Le slug ne peut pas être vide',
      'string.max': 'Le slug ne peut pas dépasser 255 caractères'
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères'
    }),
    content: Joi.string().optional().allow(''),
    featured_image: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'L\'URL de l\'image n\'est pas valide'
    }),
    category_id: Joi.string().uuid().optional().allow(null).messages({
      'string.uuid': 'L\'ID de la catégorie n\'est pas valide'
    }),
    status: Joi.string().valid('planning', 'active', 'completed', 'suspended', 'cancelled').optional().default('planning').messages({
      'any.only': 'Le statut doit être l\'un des suivants: planning, active, completed, suspended, cancelled'
    }),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional().default('medium').messages({
      'any.only': 'La priorité doit être l\'une des suivantes: low, medium, high, urgent'
    }),
    start_date: Joi.date().optional().allow(null).messages({
      'date.base': 'La date de début doit être une date valide'
    }),
    end_date: Joi.date().optional().allow(null).messages({
      'date.base': 'La date de fin doit être une date valide'
    }),
    budget: Joi.number().positive().optional().messages({
      'number.base': 'Le budget doit être un nombre',
      'number.positive': 'Le budget doit être positif'
    }),
    currency: Joi.string().length(3).optional().default('EUR').messages({
      'string.length': 'La devise doit faire exactement 3 caractères'
    }),
    countries: Joi.array().items(Joi.string().max(100)).optional().messages({
      'array.base': 'Les pays doivent être un tableau',
      'string.max': 'Le nom d\'un pays ne peut pas dépasser 100 caractères'
    }),
    beneficiaries_count: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Le nombre de bénéficiaires doit être un nombre',
      'number.integer': 'Le nombre de bénéficiaires doit être un entier',
      'number.min': 'Le nombre de bénéficiaires ne peut pas être négatif'
    }),
    partner_organizations: Joi.array().items(Joi.string().max(255)).optional().messages({
      'array.base': 'Les organisations partenaires doivent être un tableau',
      'string.max': 'Le nom d\'une organisation ne peut pas dépasser 255 caractères'
    }),
    progress_percentage: Joi.number().integer().min(0).max(100).optional().default(0).messages({
      'number.base': 'Le pourcentage de progression doit être un nombre',
      'number.integer': 'Le pourcentage de progression doit être un entier',
      'number.min': 'Le pourcentage de progression ne peut pas être négatif',
      'number.max': 'Le pourcentage de progression ne peut pas dépasser 100'
    }),
    featured: Joi.boolean().optional().default(false).messages({
      'boolean.base': 'Le champ featured doit être un booléen'
    })
  })
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      logger.error(`Validation schema '${schemaName}' not found`);
      return res.status(500).json({
        success: false,
        error: 'Validation error',
        message: 'Internal server error'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        errors
      });
    }

    // Replace request body with validated and cleaned data
    req.body = value;
    next();
  };
};

// Specific validation middleware functions
const validateArticle = validate('article');
const validateUser = validate('user');
const validateEvent = validate('event');
const validateProject = validate('project');

module.exports = {
  validateArticle,
  validateUser,
  validateEvent,
  validateProject,
  schemas
};